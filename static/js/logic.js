var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryurl, function(data) {
  console.log(data)
// Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data);
});

//create marker size base on magnitude of the earth quake
function circleSize(magnitude) {
    return magnitude * 4;
};

function getColor(magnitude) {
  if (magnitude > 5) {
      return 'darkred'
  } else if (magnitude > 4) {
      return 'red'
  } else if (magnitude > 3) {
      return 'darkorange'
  } else if (magnitude > 2) {
      return 'yellow'
  } else if (magnitude > 1) {
      return 'lightyellow'
  } else {
      return 'green'
  }
};

//create earthquake layer
function createFeatures(earthquakeData) {
 // get marker size to reflect size of mangitude 
  function onEachLayer(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      radius: circleSize(feature.properties.mag),
      fillOpacity: 0.8,
      color: getColor(feature.properties.mag),
      fillColor: getColor(feature.properties.mag)
    });
  }

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
    pointToLayer: onEachLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//create faultine layer
var faultineUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

var faultline = new L.LayerGroup();

d3.json(faultineUrl, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'orange'
            }
        },
    }).addTo(faultline);
})

//create map
function createMap(earthquakes) {
   //create different layers
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 13,
      id: "light-v10",
      accessToken: API_KEY
   });

    

   var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 13,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
  
    });
   
      // Define a baseMaps object to hold our base layers
    var baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors,    
    };
  // Create overlay object to hold our overlay layer
    var overlays = {
        "Fault Lines": faultline,
        "Earthquakes": earthquakes,
        
    };

    // Create our map, giving it the streetmap and earthquakes and faultine layers to display on load
    var myMap = L.map('map', {
        center: [0.00, 0.00],
        zoom: 3.5,
        layers: [satellite, earthquakes, faultline]
    });
// Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map

    L.control.layers(baseLayers, overlays).addTo(myMap);
 

  // Set up the legend
  // When the layer control is added, insert a div with the class of "legend"
   //create the legend
   var legend = L.control({
    position: "bottomleft"
});

legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
    magnitude = [0, 1, 2, 3, 4, 5],
    labels = [];

// Create legend
for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap);
}
