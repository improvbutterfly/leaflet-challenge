// Creating map object
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5
});

// Adding tile layer
streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap
};

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// Define a markerSize function that will give each city a different radius based on its population
function markerOptions(feature, latlng) {
  var magnitude = feature.properties.mag;
  var markerSize = magnitude * 5;
  var geojsonMarkerOptions = {fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    radius: markerSize }
  return L.circleMarker(latlng, geojsonMarkerOptions);
}

/*circle(feature.geometery.coordinates, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize(feature.properties.mag)
  }).
*/
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  earthquakes = L.geoJson(data.features, {
    pointToLayer: markerOptions,
    onEachFeature: onEachFeature
  }).addTo(myMap);


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

});