document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("projects-map");
  if (!container) return;

  var consent = __md_get("__consent");

  if (consent && consent.maps) {
    initMap(container);
  } else {
    showConsentPrompt(container);
  }
});

function showConsentPrompt(container) {
  var parent = container.parentNode;
  var placeholder = document.createElement("div");
  placeholder.id = "projects-map-consent";
  placeholder.innerHTML =
    "<p>Diese Seite lädt Karteninhalte von OpenStreetMap.</p>" +
    '<button onclick="__md_set(\'__consent\',{maps:true});location.reload()">' +
    "Einverstanden & Karte anzeigen</button>";
  parent.replaceChild(placeholder, container);
}

function initMap(container) {
  var dataEl = document.getElementById("projects-map-data");
  if (!dataEl) return;

  var projects = JSON.parse(dataEl.textContent);
  if (!projects.length) return;

  var map = L.map(container).setView([51.5, 7.5], 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var group = L.featureGroup();

  projects.forEach(function (p) {
    var marker = L.marker([p.lat, p.lng]).bindPopup(
      "<strong>" + p.name + "</strong><br>" +
      p.description +
      '<br><a href="' + p.link + '">Details</a>'
    );
    group.addLayer(marker);
  });

  group.addTo(map);
  map.fitBounds(group.getBounds().pad(0.1));
}
