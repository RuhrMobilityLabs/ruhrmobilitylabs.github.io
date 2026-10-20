"""Generate ``llms.txt`` (https://llmstxt.org/) for the built site.

Run after ``zensical build``; the file is written into the site directory:

    python scripts/generate_llms_txt.py [site_dir]
"""

import re
import sys
import tomllib
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

sys.path.insert(0, str(DOCS / "macros"))
from overviewlists import _format_label, _get_frontmatter, _get_last_modified  # noqa: E402

PROJECTS_DIR = "ÖPNV_Projekte"


def _url(site_url, path):
    """Build an absolute URL for a path relative to the site root."""
    return f"{site_url.rstrip('/')}/{quote(path)}"


def _get_body(filepath):
    """Return the Markdown content without frontmatter."""
    content = filepath.read_text(encoding="utf-8")
    return re.sub(r"^---\s*\n.*?\n---\s*\n", "", content, count=1, flags=re.DOTALL)


def _get_heading(body):
    """Return the first level-1 heading, if any."""
    match = re.search(r"^# (.+)$", body, re.MULTILINE)
    return match.group(1).strip() if match else ""


def _get_excerpt(body, max_paragraphs=1):
    """Return the first paragraphs of text, collapsed to a single line."""
    body = body.split("<!-- more -->", 1)[0]
    paragraphs = []
    for paragraph in re.split(r"\n\s*\n", body):
        paragraph = paragraph.strip()
        if paragraph and not paragraph.startswith(("#", "{{", "<", "!", "|")):
            paragraphs.append(" ".join(paragraph.split()))
    return " ".join(paragraphs[:max_paragraphs])


def _entry(title, url, description, details=()):
    """Render a single llms.txt list entry."""
    line = f"- [{title}]({url})"
    notes = " ".join(part for part in [description, *details] if part)
    return f"{line}: {notes}" if notes else line


def _blog_posts(site_url, site_dir):
    posts = []
    for index_file in sorted((DOCS / "blog" / "posts").glob("*/index.md")):
        fm = _get_frontmatter(index_file)
        if fm.get("draft") == "true":
            continue
        body = _get_body(index_file)
        dates = fm.get("date") if isinstance(fm.get("date"), dict) else {}
        created = datetime.strptime(dates["created"], "%Y-%m-%d")
        slug = fm.get("slug") or index_file.parent.name
        path = f"blog/{created:%Y/%m/%d}/{slug}.html"
        if not (site_dir / path).exists():
            print(f"warning: {path} not found in {site_dir}", file=sys.stderr)
        title = fm.get("title") or _get_heading(body) or slug
        description = fm.get("description") or _get_excerpt(body)
        details = [f"(Veröffentlicht: {created:%d.%m.%Y}"]
        categories = fm.get("categories")
        if isinstance(categories, list) and categories:
            details[0] += f"; Kategorien: {', '.join(categories)}"
        details[0] += ")"
        posts.append((created, _entry(title, _url(site_url, path), description, details)))
    # Newest posts first, like on the blog index.
    return [entry for _, entry in sorted(posts, reverse=True)]


def _projects(site_url):
    projects = []
    for index_file in sorted((DOCS / PROJECTS_DIR).glob("*/index.md")):
        fm = _get_frontmatter(index_file)
        name = index_file.parent.name
        title = _get_heading(_get_body(index_file)) or name
        facts = [
            f"{label}: {_format_label(fm[key])}"
            for key, label in [
                ("project_type", "Projektart"),
                ("transport_type", "Verkehrsmittel"),
                ("status", "Status"),
            ]
            if fm.get(key)
        ]
        cities = fm.get("cities")
        if isinstance(cities, list) and cities:
            facts.append(f"Städte: {', '.join(cities)}")
        last_modified = _get_last_modified(fm)
        if last_modified:
            facts.append(f"Bearbeitet: {last_modified}")
        details = [f"({'; '.join(facts)})"] if facts else []
        path = f"{PROJECTS_DIR}/{name}/index.html"
        projects.append(
            _entry(title, _url(site_url, path), fm.get("description", ""), details)
        )
    return projects


def generate(site_dir):
    config = tomllib.loads((ROOT / "zensical.toml").read_text(encoding="utf-8"))
    project = config["project"]
    site_url = project["site_url"]

    lines = [
        f"# {project['site_name']}",
        "",
        f"> {project['site_description']}",
        "",
        _get_excerpt(_get_body(DOCS / "index.md"), max_paragraphs=2),
        "",
        "## Seiten",
        "",
        _entry("Home", _url(site_url, "index.html"), "Startseite"),
        _entry("Blog", _url(site_url, "blog/index.html"), "Alle Blogbeiträge"),
        _entry(
            "ÖPNV Projekte",
            _url(site_url, f"{PROJECTS_DIR}/index.html"),
            _get_excerpt(_get_body(DOCS / PROJECTS_DIR / "index.md")),
        ),
        "",
        "## Blog",
        "",
        *_blog_posts(site_url, site_dir),
        "",
        "## ÖPNV Projekte",
        "",
        *_projects(site_url),
        "",
    ]
    output = site_dir / "llms.txt"
    output.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {output}")


if __name__ == "__main__":
    generate(Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "site"))
