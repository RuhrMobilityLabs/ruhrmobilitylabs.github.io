import json
import os
import re
from datetime import datetime, timezone
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

    Handles simple scalar values as well as YAML block-list fields
    (``- item`` lines following a key).
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
    return result


def _get_last_modified(filepath):
    """Return the file's last modified date as a formatted string."""
    mtime = filepath.stat().st_mtime
    return datetime.fromtimestamp(mtime, tz=timezone.utc).strftime("%d.%m.%Y")


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
        last_modified = _get_last_modified(index_file)
        link = f"[{name}]({name}/)"
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


def _generate_station_map(meta):
    """Generate an HTML map container with embedded station and connection data.

    ``meta`` is the current page's parsed front matter. A ``stations`` list is
    expected, where each entry has ``name``, ``latitude``, ``longitude`` and an
    optional ``connects_to`` list of other station names.
    """
    stations = meta.get("stations")
    if not isinstance(stations, list) or not stations:
        return ""

    result = []
    for station in stations:
        if not isinstance(station, dict):
            continue
        name = station.get("name")
        lat = station.get("latitude")
        lng = station.get("longitude")
        if name is None or lat is None or lng is None:
            continue
        connects_to = station.get("connects_to") or []
        if not isinstance(connects_to, list):
            connects_to = [connects_to]
        result.append(
            {
                "name": str(name),
                "lat": float(lat),
                "lng": float(lng),
                "connects_to": [str(c) for c in connects_to],
            }
        )

    if not result:
        return ""

    data_json = json.dumps(result, ensure_ascii=False)
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
