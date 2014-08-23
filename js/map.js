$(document).ready(function(){
  // create a map in the "map" div, set the view to a given place and zoom
  var map = L.map('map');
  window.map = map;

  // add an OpenStreetMap tile layer http://{s}.tile.osm.org/{z}/{x}/{y}.png
  L.tileLayer('http://a.tiles.mapbox.com/v3/michaeldowse.helo0de5/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  $.getJSON( "wellington.json", function( data ) {
    window.markers = add_data_to_map(data);
  });

  navigator.geolocation.getCurrentPosition( function setCenter(gps){
    userLocation = {
      "lat": gps.coords.latitude,
      "lng": gps.coords.longitude
    };

    var personMarker = L.AwesomeMarkers.icon({
      icon: 'male',
      prefix: 'fa',
      markerColor: 'orange',
      iconColor: 'white'
    });
    L.marker(userLocation, {icon: personMarker}).addTo(map);

    // Assumption: Data will be loaded before users location is ready
    find_closest(userLocation, window.markers);
  });
});

function add_data_to_map(wellingtonSampleData) {
  // Reformat coordinates json
  var locationData = wellingtonSampleData.vectorQuery.layers['2219'];
  $.map( locationData.features, function fixGeometry(feature) {
    var longLat = feature.geometry.coordinates;
    feature.geometry.coordinates = {
      'lng': longLat[0],
      'lat': longLat[1]
    };
  });

  // Start the map at the centre of Wellington
  wellingtonCentral = {
    'lng': 174.776172,
    'lat': -41.288734
  }
  window.map.setView(wellingtonCentral, 13);

  var coolMarker = L.AwesomeMarkers.icon({
    markerColor: 'blue'
  });

  var markers = []
  $.each( locationData.features, function dropMarker(index, datum) {
    if ( datum && datum.geometry && datum.geometry.coordinates ) {
      var marker = L.marker(datum.geometry.coordinates, {icon: coolMarker}).addTo(map);
      markers.push( marker );

      // FIXME this should be templated
      var bubbleContent = '';
      bubbleContent += '<h2>' + datum.properties.Location + '</h2>';
      bubbleContent += '<p><strong>Opening Hours</strong><br />';
      bubbleContent += datum.properties.Open_hours + '</p>';

      marker.bindPopup( bubbleContent );
    }
  });

  return markers;
}

function find_closest(userLocation, markers) {
  // Find closest loo
  var minDistance = 9999999;
  closestMarker = markers[0];

  $.each( markers, function calculateDistance(index, thisMarker) {
    var thisPopup = thisMarker.getPopup();
    var howFar = thisMarker.getLatLng().distanceTo( userLocation );
    minDistance = Math.min( minDistance, howFar );

    thisPopup.setContent(
      thisPopup.getContent() + '<p class="distance"><strong>Distance</strong><br />' + Math.round(howFar) + ' metres away</p>'
    );
    if ( minDistance == howFar ) {
      closestMarker = thisMarker;
    }
  });

  map.fitBounds([closestMarker.getLatLng(), userLocation], {"padding": [200,200]} );
  closestMarker.openPopup();
}
