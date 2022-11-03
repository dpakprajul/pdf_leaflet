var map = L.map('map').setView([49.011903881920404, 8.405687766634742], 15);

osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMGE1NmY2Yi01NzBhLTRlM2QtOTg4Ny02Y2Q4YWIxMWE1N2IiLCJpZCI6MTEzNDY0LCJpYXQiOjE2Njc0MzMzMjN9.EV8CL5GC59rzI5CWH3tmPc3xUdxcRNnwzeCcoJfRz40';

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
    query: 'node["amenity"="library"](49.011903881920404, 8.405687766634742, 49.561903881920404, 8.885687766634742);out body;>;out skel qt;',
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
    var query = '?data=[out:xml][timeout:50];(' + nodeQuery + wayQuery + relationQuery + ');out body;>;out skel qt;';
    var baseUrl = 'http://overpass-api.de/api/interpreter';
    var resultUrl = baseUrl + query;
    return resultUrl;
  }
  
  //define to3d function that converts a the building to a 3d object
    // function to3d(geojson) {
    //     var geojsonLayer = L.geoJson(geojson, {
    //         onEachFeature: function(feature, layer) {
    //             var height = feature.properties.height;
    //             var color = feature.properties.color;
    //             var shape = feature.geometry.type;
    //             var coords = feature.geometry.coordinates;
    //             var latlngs = [];
    //             if (shape == 'Polygon') {
    //                 for (var i = 0; i < coords.length; i++) {
    //                     //convert coordinates to latlngs for polygon
    //                     latlngs.push([coords[i][1], coords[i][0]]);

    //                 }
    //                 var polygon = new L.Polygon(latlngs, {
    //                     color: color,
    //                     opacity: 0.5,
    //                     fillOpacity: 0.2
    //                 });
    //                //extrude the polygon using cesium
    //                 var building = CesiumExtrudedPolygonGraphics.fromPolygon(polygon, {
    //                     height: height,
    //                     material: Cesium.Color.fromCssColorString(color)
    //                 });
    //                 //add the building to the cesium entity
    //                 var entity = viewer.entities.add({
    //                     polygon: building
    //                 });
    //             } else if (shape == 'MultiPolygon') {
    //                 for (var i = 0; i < coords.length; i++) {
    //                     var latlngs = [];
    //                     for (var j = 0; j < coords[i].length; j++) {
    //                         //convert coordinates to latlngs for polygon
    //                         latlngs.push([coords[i][j][1], coords[i][j][0]]);
    //                     }
    //                     var polygon = new L.Polygon(latlngs, {
    //                         color: color,
    //                         opacity: 0.5,
    //                         fillOpacity: 0.2
    //                     });
    //                     //extrude the polygon using cesium
    //                     var building = CesiumExtrudedPolygonGraphics.fromPolygon(polygon, {
    //                         height: height,
    //                         material: Cesium.Color.fromCssColorString(color)
    //                     });
    //                     //add the building to the cesium entity
    //                     var entity = viewer.entities.add({
    //                         polygon: building
    //                     });
    //                 }
    //             }
    //         }
    //     });
    // }

    //add the cesium layer to the map
    // var cesiumLayer = L.cesium({viewer: viewer});
    // map.addLayer(cesiumLayer);

    //add the polygon in the cesium viewer



    

  $("#query-button").click(function () {
    var queryTextfieldValue = $("#query-textfield").val();
    var overpassApiUrl = buildOverpassApiUrl(map, queryTextfieldValue);
    
    $.get(overpassApiUrl, function (osmDataAsXml) {
      var resultAsGeojson = osmtogeojson(osmDataAsXml);
        //to3d(resultAsGeojson);
        //create a json tile layer with the geojson data
        
    
      var resultLayer = L.geoJson(resultAsGeojson, 
        
        //if the result is a polygon, create a polygon
        {
            onEachFeature: function (feature, layer) {
                if (feature.geometry.type === 'Polygon') {
                    //get the height of the building
                    var height = feature.properties.tags.height;
                    //if the height is not defined, set it to 10
                    if (height === undefined) {
                        height = 10;
                    }
                    //create new LeafletLayer for the 3d building with layer and options
                    var building = L.geoJson(feature, {
                        style: function (feature) {
                            return {
                                color: '#ff7800',
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            };
                        }
                    });
                    
                    //add the 3d building to the map
                    building.addTo(map);
                    


                }

        
            }
        }
        );
       



    //     {
    //     pointToLayer: function (feature, latlng) {
    //         return L.circleMarker(latlng, {
    //             radius: 10,
    //             fillColor: "#ff7800",
    //             color: "#000",
    //             weight: 1,
    //             opacity: 0.5,
    //             fillOpacity: 0.8
    //         });

    //     },
    //     filter: function (feature, layer) {
    //       var isPolygon = (feature.geometry) && (feature.geometry.type !== undefined) && (feature.geometry.type === "Polygon");
    //       if (isPolygon) {
    //         feature.geometry.type = "Point";
    //         var polygonCenter = L.latLngBounds(feature.geometry.coordinates[0]).getCenter();
    //         feature.geometry.coordinates = [ polygonCenter.lat, polygonCenter.lng ];
    //       }
    //       return true;
    //     },
    //     onEachFeature: function (feature, layer) {
    //       var popupContent = "";
    //       var objectUrl = "http://overpass-api.de/api/interpreter?data=[out:json];" + feature.properties.type + "%28" + feature.properties.id + "%29;out;";
    //       $.get(objectUrl, function (objectDataAsJson) {
    //         popupContent = popupContent + "<dt>@id</dt><dd>" + feature.properties.type + "/" + feature.properties.id + "</dd>";
    //         var keys = Object.keys(objectDataAsJson.elements[0].tags);
    //         keys.forEach(function (key) {
    //           popupContent = popupContent + "<dt>" + key + "</dt><dd>" + objectDataAsJson.elements[0].tags[key] + "</dd>";
    //         });
    //         popupContent = popupContent + "</dl>"
    //         layer.bindPopup(popupContent);
    //       });
    //     }
    //   }).addTo(map);
    });
    });

//make a list of 40 different streets in karlsruhe
// var streets = [
//     "Amalienstraße",
//     "Kaiserstraße",
//     "Karlstraße",
//     "Königsstraße",
//     "Marktplatz",
//     "Marktstraße",
//     "Neuburger Straße",
//     "Neugasse",
//     "Neustadt",
//     "Neustadtstraße",
//     "Oberer Graben",
//     "Oberer Markt",
//     "Oberer Wilhelmstraße",
//     "Obermarkt",
//     "Oberstraße",
//     "Rathausplatz",
//     "Rathausstraße",
//     "Ritterstraße"
// ];

// //create a function to geocode the streets
// function geocodeStreet(street) {
//     var geocoder = L.Control.Geocoder.nominatim();
//     geocoder.geocode(street + ", Karlsruhe, Germany", function (results) {
//         var latlng = results[0].center;
//         var marker = L.marker(latlng).addTo(map);
//         marker.bindPopup(street);
//     });
// }

//use google geocoding api to geocode the streets
// function geocodeStreet(street) {
//     var geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ 'address': street + ", Karlsruhe, Germany" }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             var latlng = results[0].geometry.location;
//            //get the latlng and convert it to list of coordinates
//             var latlngList = [latlng.lat(), latlng.lng()];
//             //show it in the console
//             console.log(latlngList);


//             var marker = L.marker([latlng.lat(), latlng.lng()]).addTo(map);
//             marker.bindPopup(street);
//         }
//     });
// }

//loop through the streets and geocode them
// streets.forEach(function (street) {
//     setTimeout(function () {
//         geocodeStreet(street);
//     }
//     , 2000);
// });




L.easyButton('fa-home fa-lg', function(){
    osmb = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json'); 
  },"Show 2.5D Buildings",'topleft').addTo(map);



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