var map = L.map('map').setView([49.011903881920404, 8.405687766634742], 15);

osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// //add another basemap
stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);



//get the forest layer from openstreetmap using overpass turbo with the following query
//http://overpass-turbo.eu/s/1Z0
//node["natural"="wood"](51.5,-0.1,51.6,-0.2);
//out body;
//>;
//out skel qt;




var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
var attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var osm = new L.TileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        'opacity': 0.7,
        'attribution': [attr_osm, attr_overpass].join(', ')
    }
);



//create OverpassLayer with the forest polygons with germany bounding box
var forestLayer = new L.OverPassLayer({
    query: 'node["amenity"="restaurant"](48.911903881920404, 8.405687766634742,49.01491617366377 ,8.41696147341304);out body;>;out skel qt;',
    callback: function(data) {
        return L.geoJson(data, {
            style: function(feature) {
                return {color: 'green'};
            }
        });
    }
}).addTo(map);

//make query from the user



//add options to the layer control
var baseMaps = {
    "OpenStreetMap": osm,
    "Stamen Toner": stamen,
    "Forest": forestLayer
};

L.control.layers(baseMaps).addTo(map);


L.control.browserPrint().addTo(map);
L.control.locate().addTo(map);
L.simpleMapScreenshoter().addTo(map)