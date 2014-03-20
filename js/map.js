(function($) {
  var centerMap = { 'lng': 174.77418326567965, 'lat': -41.26205894817599 };
  // create a map in the "map" div, set the view to a given place and zoom

  var map = L.map('map').setView(centerMap, 13);
  // add an OpenStreetMap tile layer
  L.tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      'attribution': '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  $.getJSON('wellington.json', function(sampleData){
    var userLocation = null;
    var markers = [];
    var locationData = sampleData.vectorQuery.layers['2219'];

    // Fix geometry
    $.map( locationData.features, function fixGeometry(feature) {
      var longLat = feature.geometry.coordinates;
      feature.geometry.coordinates = {
        'lng': longLat[0],
      'lat': longLat[1]
      };
    });

    $.each( locationData.features, function dropMarker(i, datum) {
      if ( datum && datum.geometry && datum.geometry.coordinates ) {
        var seed   = new Date().getTime()
      var rating = Math.floor( Math.random( seed ) * 5 ) + 1; // 1 to 5
    var marker = L.marker(datum.geometry.coordinates).addTo(map);
    markers.push( marker );

    var stars;
    switch(rating) {
      case 1 : stars = 'S <span class="grey">S S S S</span>';     break;
      case 2 : stars = 'S S <span class="grey">S S S</span>';    break;
      case 3 : stars = 'S S S <span class="grey">S S</span>';   break;
      case 4 : stars = 'S S S S <span class="grey">S</span>';  break;
      case 5 : stars = 'S S S S S'; break;
    }

    // FIXME this should be templated
    var bubbleContent = '';
    bubbleContent += '<h2>' + datum.properties.Location + '</h2>';
    bubbleContent += '<p><span class="icon">' + stars + '</span></p>';
    bubbleContent += '<p class="hours">' + datum.properties.Open_hours + '</p>';
    if ( datum.properties.Disabled === 'Yes' ) {
      bubbleContent += '<img src="images/disabled.png"> ' + 'Disability friendly';
    }else {
      bubbleContent += 'No Disability';
      // return;
    }
    marker.bindPopup( bubbleContent );
    window.loo = datum.properties;
      }
    });

    navigator.geolocation.getCurrentPosition( function setCenter(gps){
      userLocation = {
        "lat": gps.coords.latitude,
      "lng": gps.coords.longitude
      };
      map.setView(userLocation, 13);

      // Find closest loo
      var minDistance = 99999;
      var closestMarker = markers[0];

      $.each( markers, function calculateDistance(i, thisMarker) {
        var thisPopup = thisMarker.getPopup();
        var howFar = thisMarker.getLatLng().distanceTo( userLocation );
        minDistance = Math.min( minDistance, howFar );

        thisPopup.setContent(
          thisPopup.getContent()
          + '<p class="distance">' + Math.round(howFar) + ' metres away</p>'
          );

        if ( minDistance === howFar ) {
          closestMarker = thisMarker;
        }
      });

      closestMarker.getPopup().setContent(
          closestMarker.getPopup().getContent()
          );

      closestMarker.openPopup();
    });
  });
})(jQuery)
