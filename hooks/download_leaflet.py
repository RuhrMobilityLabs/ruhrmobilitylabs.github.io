import os
import urllib.request

LEAFLET_BASE = "https://unpkg.com/leaflet@1.9.4/dist"
LEAFLET_CSS = f"{LEAFLET_BASE}/leaflet.css"
LEAFLET_JS = f"{LEAFLET_BASE}/leaflet.js"
LEAFLET_IMAGES = ["marker-icon.png", "marker-shadow.png", "layers.png", "layers-2x.png"]


def on_page_content(html, **kwargs):
    if "projects-map" in html:
        html += f'<link rel="stylesheet" href="{LEAFLET_CSS}">'
        html += f'<script src="{LEAFLET_JS}"></script>'
    return html


def on_post_build(config):
    site_dir = config.site_dir
    images_dir = os.path.join(site_dir, "assets", "external", "unpkg.com", "leaflet@1.9.4", "dist", "images")
    os.makedirs(images_dir, exist_ok=True)
    for name in LEAFLET_IMAGES:
        url = f"{LEAFLET_BASE}/images/{name}"
        dest = os.path.join(images_dir, name)
        if not os.path.exists(dest):
            urllib.request.urlretrieve(url, dest)
