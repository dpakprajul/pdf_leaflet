var map = L.map('map').setView([49.011903881920404, 8.405687766634742], 15);

osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//add a stamen basemap
var stamen = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
}).addTo(map);



var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
var attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var osm = new L.TileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        'opacity': 0.7,
        'attribution': [attr_osm, attr_overpass].join(', ')
    }
);

//create overpassLayer with the drinking water query with germany bounding box
var restaurant = new L.OverPassLayer({
    query: 'node["amenity"="restaurant"](49.011903881920404, 8.405687766634742, 49.561903881920404, 8.885687766634742);out body;>;out skel qt;',
    minzoom: 15,
    callback: function(data) {
        return L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }


        });
    }
});


var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
var attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var osm = new L.TileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        'opacity': 0.7,
        'attribution': [attr_osm, attr_overpass].join(', ')
    }
);

//create overpassLayer with the drinking water query with germany bounding box
var library = new L.OverPassLayer({
    query: 'node["amenity"="library"](49.011903881920404, 8.405687766634742, 49.061903881920404, 8.585687766634742);out body;>;out skel qt;',
    minzoom: 15,
    callback: function(data) {
        return L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
           
            }


        });
    }
});
library.addTo(map);
//add the overpassLayer to the map
restaurant.addTo(map);


function buildOverpassApiUrl(map, overpassQuery) {
    var bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
    var nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
    var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
    var relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
    var query = '?data=[out:xml][timeout:25];(' + nodeQuery + wayQuery + relationQuery + ');out body;>;out skel qt;';
    var baseUrl = 'http://overpass-api.de/api/interpreter';
    var resultUrl = baseUrl + query;
    return resultUrl;
  }
  $("#query-button").click(function () {
    var queryTextfieldValue = $("#query-textfield").val();
    var overpassApiUrl = buildOverpassApiUrl(map, queryTextfieldValue);
    
    $.get(overpassApiUrl, function (osmDataAsXml) {
      var resultAsGeojson = osmtogeojson(osmDataAsXml);
      var resultLayer = L.geoJson(resultAsGeojson, 
        //if the result is a point, create a circle marker
        {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 10,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.8
            });

        },
        filter: function (feature, layer) {
          var isPolygon = (feature.geometry) && (feature.geometry.type !== undefined) && (feature.geometry.type === "Polygon");
          if (isPolygon) {
            feature.geometry.type = "Point";
            var polygonCenter = L.latLngBounds(feature.geometry.coordinates[0]).getCenter();
            feature.geometry.coordinates = [ polygonCenter.lat, polygonCenter.lng ];
          }
          return true;
        },
        onEachFeature: function (feature, layer) {
          var popupContent = "";
          var objectUrl = "http://overpass-api.de/api/interpreter?data=[out:json];" + feature.properties.type + "%28" + feature.properties.id + "%29;out;";
          $.get(objectUrl, function (objectDataAsJson) {
            popupContent = popupContent + "<dt>@id</dt><dd>" + feature.properties.type + "/" + feature.properties.id + "</dd>";
            var keys = Object.keys(objectDataAsJson.elements[0].tags);
            keys.forEach(function (key) {
              popupContent = popupContent + "<dt>" + key + "</dt><dd>" + objectDataAsJson.elements[0].tags[key] + "</dd>";
            });
            popupContent = popupContent + "</dl>"
            layer.bindPopup(popupContent);
          });
        }
      }).addTo(map);
    });
    });



//add a layer control
L.control.layers({
    'Stamen': stamen,
    'OSM': osm,
    'Restaurant': restaurant,
    'Library': library

}).addTo(map);


L.control.browserPrint().addTo(map);
L.control.locate().addTo(map);
L.simpleMapScreenshoter().addTo(map)