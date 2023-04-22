// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, colorcode) {
      var color;
      if (feature.geometry.coordinates[2] <= 10) {
        color = '#c1ec61';
      } else if (feature.geometry.coordinates[2] <= 20) {
        color = '#eac863';
      } else if (feature.geometry.coordinates[2] <= 30) {
        color = '#e2ab50';
      } else if (feature.geometry.coordinates[2] <= 40) {
        color = '#e59527';
      } else if (feature.geometry.coordinates[2] <= 50) {
        color = '#c16216';
      } else {
        color = '#e13023';
      };

      var markerOptions = {
        radius: 5*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        fillOpacity: 0.9
      };
      return L.circleMarker(colorcode, markerOptions);
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

// Make legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.backgroundColor = 'white';
  
  // Add HTML for legend with colored boxes
  div.innerHTML += '<i style="background:#c1ec61"></i> <10<br>';
  div.innerHTML += '<i style="background:#eac863"></i> 10-20<br>';
  div.innerHTML += '<i style="background:#e2ab50"></i> 20-30<br>';
  div.innerHTML += '<i style="background:#e59527"></i> 30-40<br>';
  div.innerHTML += '<i style="background:#c16216"></i> 40-50<br>';
  div.innerHTML += '<i style="background:#e13023"></i> >50<br>';

  return div;
};
legend.addTo(myMap);
}
