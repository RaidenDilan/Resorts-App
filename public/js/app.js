'use strict';

// var resort = resort || {};

$(function () {
  var $links = $('nav a');
  var $menu = $('.menu');
  var $map = $('#map');
  var $input = $('.autocomplete');
  var $weather = $('#weather'); // var weather = $('#weather').data('resort');
  var successMessage = $('.success');
  var closeMessageBtn = $('.close-message');
  var map = null;
  var infowindow = null;

  if ($map.length) initMap();
  if ($input.length) resortAutocomplete();
  if ($weather.length) resortWeather();
  if ($links.length) $links.on('click');
  if ($menu.length) $menu.on('click', toggleMenu);
  if (closeMessageBtn.length) closeMessageBtn.on('click', function () {
    return successMessage.css({
      opacity: '0', transform: 'translateY(-26px)', transition: 'transform 250ms linear, opacity 250ms linear'
    });
  });

  // // PREPARE FORM DATA
  //   var formData = {
  //     cityname: $('#cityname').val()
  //     // lastname: $("#lastname").val()
  //   };
  //
  // // DO POST
  // $.ajax({
  //   type: 'POST',
  //   contentType: 'application/json',
  //   url: window.location + 'api/resorts/:id',
  //   data: JSON.stringify(formData),
  //   dataType: 'json',
  //   success: (output) => {
  //     console.log('output', output);
  //     // $('#postResultDiv').html(
  //     //   '<p>' +
  //     //     '<br>' +
  //     //     //.replace(/\"([^"]+)\":/g, "$1:")
  //     //     '' +
  //     //     JSON.stringify(`<code> ${output.addname} </code> Current Tempeature is <code>${output.temp}<sup>o</sup>C </code>`) +
  //     //     '</p>'
  //     // );
  //   },
  //   error: (e) => {
  //     alert('Error!');
  //     console.log('ERROR: ', e);
  //   }
  // });

  function resortWeather() {
    var lat = $weather.data('lat');
    var lng = $weather.data('lng');

    // const apiKey = process.env.OPENWEATHER_API_KEY;
    var apiKey = 'c0aaf890acd712dca9aeaac226d30652';
    var baseUrl = 'http://api.openweathermap.org/data/2.5';

    // $.get(`https://api.wunderground.com/api/4dfbb04b4a67e340/geolookup/q/${lat},${lng}.json`)
    $.get(baseUrl + '/weather?lat=' + lat + '&lon=' + lng + '&units=metric&appid=' + apiKey).done(function (response) {
      if (response.hasOwnProperty(response.weather[0].description) !== null || undefined) $weather.append('<p><strong>Cloudiness:</strong> ' + response.weather[0].description + '</p>');
      if (response.hasOwnProperty(response.main.temp) !== null || undefined) $weather.append('<p><strong>Temperature:</strong> ' + response.main.temp + '\xB0C</p>');
      if (response.hasOwnProperty(response.main.humidity) !== null || undefined) $weather.append('<p><strong>Humidity:</strong> ' + response.main.humidity + '%</p>');
      if (response.hasOwnProperty(response.main.pressure) !== null || undefined) $weather.append('<p><strong>Pressure:</strong> ' + response.main.pressure + ' mb</p>');
      if (response.hasOwnProperty(response.wind.speed) !== null || undefined) $weather.append('<p><strong>Wind Speed:</strong> ' + response.wind.speed + ' mph</p>');
      if (response.hasOwnProperty(response.wind.deg) !== null || undefined) $weather.append('<p><strong>Wind Direction:</strong> ' + response.wind.deg + '\xB0</p>');
      // if (response.hasOwnProperty(response.wind.gust) !== undefined) $weather.append(`<p><strong>Wind Gust:</strong> ${response.wind.gust}</p>`);
      // if (response.hasOwnProperty(response.sys.sunrise) !== null || undefined) $weather.append(`<p><strong>Sunrise:</strong> ${response.sys.sunrise}</p>`);
      // if (response.hasOwnProperty(response.sys.sunset) !== null || undefined) $weather.append(`<p><strong>Sunset:</strong> ${response.sys.sunset}</p>`);
    });
  }

  function resortAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete($input[0]);

    var $lat = $('input[name=lat]');
    var $lng = $('input[name=lng]');

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      var location = place.geometry.location.toJSON();
      $lat.val(location.lat);
      $lng.val(location.lng);
    });
  }

  function toggleMenu() {
    $('.dropdown').slideToggle();
  }

  function initMap() {
    var lat = $map.data('lat');
    var lng = $map.data('lng');
    var latLng = { lat: lat, lng: lng };

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: latLng,
      scrollwheel: false,
      styles: mapStyles
    });

    addMarker(location);
  }

  function addMarker(location) {
    var lat = $map.data('lat');
    var lng = $map.data('lng');
    var latLng = { lat: lat, lng: lng };

    var marker = new google.maps.Marker({
      position: latLng,
      map: map
      // icon: '../assets/images/dot.svg'
    });

    marker.addListener('click', function () {
      return markerClick(marker, location);
    });
  }

  function markerClick(marker) {
    if (infowindow) infowindow.close();

    infowindow = new google.maps.InfoWindow({
      content: '<div class="infowindow">\n        <h3>General Assembly London</h3>\n        <p><strong>Address: </strong>The Relay Building, 1 Commercial St, London E1 7PT</p>\n        <p><strong>Phone: </strong>020 3308 9506</p>\n      </div>'
    });

    infowindow.open(map, marker);
  }
});