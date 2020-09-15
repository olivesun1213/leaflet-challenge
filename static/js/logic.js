// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data)
// Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data);
});

function createFeatures(earthquakeData) {

  //function onEachLayer(feature) {
    //return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      //radius: circleSize(feature.properties.mag),
      //fillOpacity: 0.8,
      //color: getColor(feature.properties.mag),
      //fillColor: getColor(feature.properties.mag)
    //});
  //}

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    //pointToLayer: onEachLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satellite, grayscale and outdoor map layers
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoor= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellite,
    "Grayscale": grayscale,
    "Outdoor": outdoor,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      0.00, 0.00
    ],
    zoom: 2,
    layers: [satellite, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap); }

   // Create a legend to display information about our map
   var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
      labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      //colors = ["green", "greenyellow", "yellowgreen", "yellow", "orange", "red"];

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' +
              labels[i] + '<br>' ;
    }
    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);


  //// Adds Legend
  //let legend = L.control({position: 'bottomright'});
  //legend.onAdd = function(myMap) {
    //let div = L.DomUtil.create('div', 'legend'),
      //grades = [0, 1, 2, 3, 4, 5],
      //labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
//
    //for (let i = 0; i < grades.length; i++) {
      //div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              //grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    //}
//
    //return div;
  //};
  //legend.addTo(myMap);



// Create function to set the color for different magnitude
function getColor(magnitude) {
    // Conditionals for magnitude
    if (magnitude >= 5) {
      return "red";
    }
    else if (magnitude >= 4) {
      return "peru";
    }
    else if (magnitude >= 3) {
     return "darkorange";
    }
    else if (magnitude >= 2) {
      return "yellow";
    }
    else if (magnitude >= 1) {
      return "yellowgreen";
    }
    else {
      return "green";
    }
};

// Define a circleSize function that will give each city a different radius based on its population
function circleSize(magnitude) {
  return magnitude ** 2;
}