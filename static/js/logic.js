
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var baseMaps = {
  "Street Map": streetmap
};


var earthquakeMarkers = [];


var map = L.map("map", {
  center: [0, 0],
  zoom: 2,
  layers: [streetmap]
});

L.control.layers(baseMaps, {}, {
  collapsed: false
}).addTo(map);


d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson').then(function (data) {
  createMarkers(data, map);
  createLegend(map);
});

function getRedMarkerColor(depth) {
  if (depth < 10) {
    return "#fee5d9";
  } else if (depth < 20) {
    return "#fcbba1";
  } else if (depth < 30) {
    return "#fc9272";
  } else if (depth < 40) {
    return "#fb6a4a";
  } else if (depth < 50) {
    return "#ef3b2c";
  } else if (depth < 60) {
    return "#cb181d";
  } else if (depth < 70) {
    return "#a50f15";
  } else if (depth < 80) {
    return "#67000d";
  } else if (depth < 90) {
    return "#490006";
  } else {
    return "#320003";
  }
}

function createMarkers(response, map) {

  var features = response.features;


  for (var index = 0; index < features.length; index++) {
    var earthquake = features[index];

    var magnitude = earthquake.properties.mag;

    var depth = earthquake.geometry.coordinates[2];

    var markerSize = magnitude * 5;

    var markerColor = getRedMarkerColor(depth);


    var earthquakeMarker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: markerSize,
      fillColor: markerColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup("<h3>" + earthquake.properties.place + "<h3><h3>Magnitude: " + magnitude + "</h3><h3>Depth: " + depth + "</h3>");

    earthquakeMarker.addTo(map);
  }
}

function createLegend(map) {
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    var labels = [];

    div.innerHTML = '<h4>Depth Legend</h4>';

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getRedMarkerColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(map);
}


