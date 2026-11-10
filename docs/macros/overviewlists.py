import json
import os
import re
from datetime import datetime
from pathlib import Path

STATUS_COLORS = {
    "idee": "#6c757d",
    "antrag": "#fd7e14",
    "geplant": "#0d6efd",
    "im_bau": "#198754",
    "fertiggestellt": "#198754",
    "abgelehnt": "#dc3545",
}

PROJECT_TYPE_COLORS = {
    "neubau": "#0d6efd",
    "reaktivierung": "#6f42c1",
}

TRANSPORT_TYPE_COLORS = {
    "eisenbahn": "#dc3545",
    "stadtbahn": "#fd7e14",
    "maglev": "#6f42c1",
    "bus": "#198754",
    "oberleitungsbus": "#20c997",
    "seilbahn": "#0dcaf0",
    "faehre": "#0d6efd",
}


def _format_label(value):
    """Convert an underscore-separated key into a display label."""
    return value.replace("_", " ").title()


def _get_frontmatter(filepath):
    """Parse YAML frontmatter into a dict (minimal, no external deps).

    Handles simple scalar values, YAML block-list fields (``- item`` lines
    following a key) and one level of nested ``key: value`` mappings.
    """
    content = filepath.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return {}
    result = {}
    current_key = None
    for line in match.group(1).splitlines():
        if re.match(r"^\S", line) and ":" in line:
            key, value = line.split(":", 1)
            value = value.strip().strip("\"'")
            current_key = key.strip()
            if value:
                result[current_key] = value
            else:
                result.setdefault(current_key, [])
        elif re.match(r"^\s+- ", line) and current_key:
            item = line.strip().lstrip("- ").strip("\"'")
            if isinstance(result[current_key], list):
                result[current_key].append(item)
            else:
                result[current_key] = [item]
        elif re.match(r"^\s+[^\s-][^:]*:", line) and current_key:
            if result[current_key] == [] or isinstance(result[current_key], dict):
                if not isinstance(result[current_key], dict):
                    result[current_key] = {}
                key, value = line.split(":", 1)
                result[current_key][key.strip()] = value.strip().strip("\"'")
    return result


def _get_last_modified(fm):
    """Return the ``date.updated`` (or ``date.created``) frontmatter value as a formatted string."""
    dates = fm.get("date")
    if not isinstance(dates, dict):
        return ""
    value = dates.get("updated") or dates.get("created")
    if not value:
        return ""
    try:
        return datetime.strptime(value, "%Y-%m-%d").strftime("%d.%m.%Y")
    except ValueError:
        return value


def _badge(value, color_map):
    """Render a value as a colored HTML badge."""
    label = _format_label(value)
    color = color_map.get(value, "#6c757d")
    return (
        f'<span style="background-color:{color};color:#fff;'
        f"padding:2px 8px;border-radius:4px;font-size:0.85em;"
        f'font-weight:500;">{label}</span>'
    )


def _generate_projects_table(section_dir):
    """Generate an overview table of all projects with type, transport, status and last modified."""
    base = Path(os.path.dirname(__file__)).resolve().parent
    section_path = base / section_dir

    if not section_path.is_dir():
        return "*[No projects found]*"

    rows = []
    for entry in sorted(section_path.iterdir()):
        if not entry.is_dir():
            continue
        index_file = entry / "index.md"
        if not index_file.exists():
            continue

        fm = _get_frontmatter(index_file)
        name = entry.name
        description = fm.get("description", "")
        project_type = fm.get("project_type", "")
        transport_type = fm.get("transport_type", "")
        status = fm.get("status", "")
        cities = fm.get("cities", [])
        cities_str = ", ".join(cities) if isinstance(cities, list) else ""
        last_modified = _get_last_modified(fm)
        link = f"[{name}]({name}/index.md)"
        type_badge = _badge(project_type, PROJECT_TYPE_COLORS) if project_type else ""
        transport_badge = (
            _badge(transport_type, TRANSPORT_TYPE_COLORS) if transport_type else ""
        )
        status_badge = _badge(status, STATUS_COLORS) if status else ""
        rows.append(
            (
                link,
                description,
                type_badge,
                transport_badge,
                status_badge,
                cities_str,
                last_modified,
            )
        )

    if not rows:
        return "*[No projects found]*"

    lines = [
        "| Name | Projektart | Verkehrsmittel | Status | Städte | Bearbeitet |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for link, desc, ptype, ttype, status, cities, date in rows:
        lines.append(f"| {link} | {ptype} | {ttype} | {status} | {cities} | {date} |")

    return "\n".join(lines)


def generate_projects_table():
    """Generate an overview table of all projects."""
    return _generate_projects_table("ÖPNV_Projekte")


def _generate_projects_map(section_dir):
    """Generate an HTML map container with embedded project coordinate data."""
    base = Path(os.path.dirname(__file__)).resolve().parent
    section_path = base / section_dir

    if not section_path.is_dir():
        return ""

    projects = []
    for entry in sorted(section_path.iterdir()):
        if not entry.is_dir():
            continue
        index_file = entry / "index.md"
        if not index_file.exists():
            continue

        fm = _get_frontmatter(index_file)
        lat = fm.get("latitude")
        lng = fm.get("longitude")
        if not lat or not lng:
            continue

        name = entry.name
        description = fm.get("description", "")
        link = f"{name}/"
        projects.append(
            {
                "name": name,
                "lat": float(lat),
                "lng": float(lng),
                "description": description,
                "link": link,
            }
        )

    if not projects:
        return ""

    data_json = json.dumps(projects, ensure_ascii=False)
    return (
        '<script type="application/json" id="projects-map-data">'
        f"{data_json}</script>"
        '<div id="projects-map"></div>'
    )


def generate_projects_map():
    """Generate an interactive map of all projects with coordinates."""
    return _generate_projects_map("ÖPNV_Projekte")


TRACK_TYPES = ("in_street", "segregated", "independent")

DEFAULT_EDGE_COLOR = "#4181bb"


def _parse_point(point):
    """Parse a via point given as ``[lat, lng]`` or ``{latitude, longitude}``."""
    if isinstance(point, dict):
        lat = point.get("latitude", point.get("lat"))
        lng = point.get("longitude", point.get("lng"))
    elif isinstance(point, (list, tuple)) and len(point) == 2:
        lat, lng = point
    else:
        return None
    try:
        return [float(lat), float(lng)]
    except (TypeError, ValueError):
        return None


def _parse_track(track, source, target):
    """Validate a track type, warning about and dropping unknown values."""
    if track is None or track in TRACK_TYPES:
        return track
    print(
        f"WARNING: station map: unknown track type '{track}' on "
        f"'{source}' -> '{target}' (expected one of {', '.join(TRACK_TYPES)})"
    )
    return None


def _parse_connection(source, conn):
    """Normalize one ``connects_to`` entry into an edge dict (or ``None``).

    An entry is either a plain station name or a mapping with the keys
    ``to`` (required), ``color``, ``track``, ``planned``, ``label`` and ``via``.
    """
    if not isinstance(conn, dict):
        conn = {"to": conn}
    target = conn.get("to")
    if target is None:
        return None

    track = _parse_track(conn.get("track"), source, target)

    # Each via entry is ``(point, track)`` where ``track`` is the track type
    # starting at that point, or ``None`` if it does not change there.
    via = []
    for point in conn.get("via") or []:
        parsed = _parse_point(point)
        if parsed is None:
            print(
                f"WARNING: station map: invalid via point {point!r} on "
                f"'{source}' -> '{target}'"
            )
            continue
        change = None
        if isinstance(point, dict) and "track" in point:
            change = _parse_track(point["track"], source, target)
        via.append((parsed, change))

    label = conn.get("label")
    return {
        "from": str(source),
        "to": str(target),
        "color": str(conn.get("color") or DEFAULT_EDGE_COLOR),
        "track": track,
        "planned": bool(conn.get("planned", False)),
        "label": str(label) if label else None,
        "via": via,
    }


def _split_segments(edge, coords):
    """Replace an edge's ``via``/``track`` with ``segments`` of uniform track type.

    Each segment is ``{"track": ..., "points": [[lat, lng], ...]}``; consecutive
    segments share their boundary point so the drawn line stays continuous.
    """
    track = edge.pop("track")
    via = edge.pop("via")
    points = [coords[edge["from"]]]
    segments = []
    for point, change in via:
        points.append(point)
        if change is not None and change != track:
            segments.append({"track": track, "points": points})
            track, points = change, [point]
    points.append(coords[edge["to"]])
    segments.append({"track": track, "points": points})
    edge["segments"] = segments
    return edge


def _generate_station_map(meta):
    """Generate an HTML map container with embedded station and connection data.

    ``meta`` is the current page's parsed front matter. A ``stations`` list is
    expected, where each entry has ``name``, ``latitude``, ``longitude`` and an
    optional ``connects_to`` list. Each ``connects_to`` entry is either the name
    of another station or a mapping::

        connects_to:
          - "Stahlwerk"                     # plain connection, default style
          - to: "Gasometer"
            color: "#e3000f"                # line color (e.g. per branch)
            label: "Linie 105"              # shown in popup and legend
            track: segregated               # in_street | segregated | independent
            planned: true                   # optional/planned extension (dashed)
            via:                            # intermediate points, ordered from
              - [51.4921, 6.8780]           # this station towards ``to``
              - {latitude: 51.4925, longitude: 6.8760}
              - {latitude: 51.4930, longitude: 6.8740, track: in_street}

    A via point given as a mapping may set ``track``: the track type then
    changes at that point and applies until the next change or ``to``.

    A connection only needs to be defined on one of its two stations. If it is
    defined on both, a mapping entry wins over a plain name; otherwise the first
    definition wins.
    """
    stations = meta.get("stations")
    if not isinstance(stations, list) or not stations:
        return ""

    result = []
    raw_connections = []
    coords = {}
    for station in stations:
        if not isinstance(station, dict):
            continue
        name = station.get("name")
        lat = station.get("latitude")
        lng = station.get("longitude")
        if name is None or lat is None or lng is None:
            continue
        result.append({"name": str(name), "lat": float(lat), "lng": float(lng)})
        coords[str(name)] = [float(lat), float(lng)]
        connects_to = station.get("connects_to") or []
        if not isinstance(connects_to, list):
            connects_to = [connects_to]
        raw_connections.extend((name, c) for c in connects_to)

    if not result:
        return ""

    # Keyed by the unordered station pair so each connection is drawn once.
    # A detailed (mapping) definition takes precedence over a plain name.
    edges = {}
    for source, conn in raw_connections:
        edge = _parse_connection(source, conn)
        if edge is None:
            continue
        if edge["to"] not in coords:
            print(
                f"WARNING: station map: '{edge['from']}' connects to unknown "
                f"station '{edge['to']}'"
            )
            continue
        key = frozenset((edge["from"], edge["to"]))
        detailed = isinstance(conn, dict)
        if key in edges and (edges[key][1] or not detailed):
            continue
        edges[key] = (edge, detailed)
    edges = [_split_segments(edge, coords) for edge, _ in edges.values()]

    data_json = json.dumps(
        {"stations": result, "edges": edges}, ensure_ascii=False
    ).replace("</", "<\\/")
    return (
        '<script type="application/json" id="station-map-data">'
        f"{data_json}</script>"
        '<div id="station-map"></div>'
    )


def _badge_macro(value, color):
    """Render a value as a colored HTML badge (macro version)."""
    return (
        f'<span style="background-color:{color};color:#fff;'
        f"padding:2px 8px;border-radius:4px;font-size:0.85em;"
        f'font-weight:500;">{_format_label(value)}</span>'
    )


def define_env(env):
    """Register macros for mkdocs-macros-plugin."""
    env.macro(generate_projects_table)
    env.macro(generate_projects_map)
    env.macro(_badge_macro, "badge")

    def generate_station_map():
        """Render a map of all stations and connections from the page front matter."""
        page = getattr(env, "page", None)
        meta = getattr(page, "meta", None) or {}
        return _generate_station_map(meta)

    env.macro(generate_station_map)
