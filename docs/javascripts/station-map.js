document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("station-map");
  if (!container) return;

  var consent = __md_get("__consent");

  if (consent && consent.maps) {
    initStationMap(container);
  } else {
    showStationMapConsent(container);
  }
});

function showStationMapConsent(container) {
  var parent = container.parentNode;
  var placeholder = document.createElement("div");
  placeholder.id = "station-map-consent";
  placeholder.innerHTML =
    "<p>Diese Seite lädt Karteninhalte von OpenStreetMap.</p>" +
    '<button onclick="__md_set(\'__consent\',{maps:true});location.reload()">' +
    "Einverstanden & Karte anzeigen</button>";
  parent.replaceChild(placeholder, container);
}

var STATION_MAP_TRACK_LABELS = {
  in_street: "Straßenbündig",
  segregated: "Besonderer Bahnkörper",
  independent: "Unabhängiger Bahnkörper",
};

// Returns the polyline layers (base line plus optional center stripe) used
// to draw a connection with the given color, track type and planned state.
function stationMapEdgeStyles(color, track, planned) {
  var opacity = planned ? 0.6 : 0.9;
  var base = {
    color: color,
    weight: track ? 7 : 4,
    opacity: opacity,
    lineCap: planned ? "butt" : "round",
    dashArray: planned ? "12 8" : null,
  };
  var styles = [base];
  if (track === "segregated") {
    styles.push({ color: "#fff", weight: 2, opacity: opacity, interactive: false });
  } else if (track === "in_street") {
    styles.push({
      color: "#fff",
      weight: 2,
      opacity: opacity,
      dashArray: "4 6",
      lineCap: "butt",
      interactive: false,
    });
  }
  return styles;
}

function stationMapEscape(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Small inline SVG preview of an edge style for the legend.
function stationMapLegendSample(color, track, planned) {
  var lines = stationMapEdgeStyles(color, track, planned)
    .map(function (st) {
      return (
        '<line x1="2" y1="8" x2="38" y2="8" stroke="' + st.color + '"' +
        ' stroke-width="' + st.weight + '" stroke-opacity="' + st.opacity + '"' +
        (st.dashArray ? ' stroke-dasharray="' + st.dashArray + '"' : "") +
        ' stroke-linecap="' + (st.lineCap || "round") + '"/>'
      );
    })
    .join("");
  return '<svg width="40" height="16" aria-hidden="true">' + lines + "</svg>";
}

function addStationMapLegend(map, edges) {
  var rows = [];
  var seenLabels = {};
  var seenTracks = {};
  var hasPlanned = false;
  edges.forEach(function (e) {
    if (e.label && !seenLabels[e.label]) {
      seenLabels[e.label] = true;
      rows.push([stationMapLegendSample(e.color, null, false), e.label]);
    }
    (e.segments || []).forEach(function (seg) {
      if (seg.track) seenTracks[seg.track] = true;
    });
    if (e.planned) hasPlanned = true;
  });
  Object.keys(STATION_MAP_TRACK_LABELS).forEach(function (track) {
    if (seenTracks[track]) {
      rows.push([stationMapLegendSample("#555", track, false), STATION_MAP_TRACK_LABELS[track]]);
    }
  });
  if (hasPlanned) {
    rows.push([stationMapLegendSample("#555", null, true), "Geplant / optional"]);
  }
  if (!rows.length) return;

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "station-map-legend");
    div.innerHTML = rows
      .map(function (r) {
        return "<div>" + r[0] + "<span>" + stationMapEscape(r[1]) + "</span></div>";
      })
      .join("");
    return div;
  };
  legend.addTo(map);
}

function initStationMap(container) {
  var dataEl = document.getElementById("station-map-data");
  if (!dataEl) return;

  var data = JSON.parse(dataEl.textContent);
  var stations = data.stations || [];
  var edges = data.edges || [];
  if (!stations.length) return;

  var map = L.map(container).setView([51.5, 7.5], 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var group = L.featureGroup();

  // Draw solid (existing) connections above planned ones.
  edges
    .slice()
    .sort(function (a, b) {
      return (b.planned ? 1 : 0) - (a.planned ? 1 : 0);
    })
    .forEach(function (e) {
      var title = "<strong>" + stationMapEscape(e.from) + " – " + stationMapEscape(e.to) + "</strong>";
      if (e.label) title += "<br>" + stationMapEscape(e.label);

      // A connection consists of one or more segments with uniform track type.
      (e.segments || []).forEach(function (seg) {
        var popup = title;
        if (seg.track) popup += "<br>" + STATION_MAP_TRACK_LABELS[seg.track];
        if (e.planned) popup += "<br><em>Geplant / optional</em>";

        stationMapEdgeStyles(e.color, seg.track, e.planned).forEach(function (st, i) {
          var line = L.polyline(seg.points, st);
          if (i === 0) line.bindPopup(popup);
          group.addLayer(line);
        });
      });
    });

  stations.forEach(function (s) {
    group.addLayer(L.marker([s.lat, s.lng]).bindPopup("<strong>" + stationMapEscape(s.name) + "</strong>"));
  });

  group.addTo(map);
  map.fitBounds(group.getBounds().pad(0.1));
  addStationMapLegend(map, edges);
}
