'use strict';

var ACCESS_TOKEN = 'pk.eyJ1Ijoiam9yamViYXJyZXJhIiwiYSI6IklWa1JXM1EifQ.BJDcoEfnAsKO7CMvT7CaIw';
var MAP_ID = 'jorjebarrera.jlk69o32';
var DATA_ENDPOINT = 'https://data.sfgov.org/resource/cuks-n6tp.json';
var APP_TOKEN = 'bRhhd0RZidBn2aCnqgNM1QBJL';

L.mapbox.accessToken = ACCESS_TOKEN;

var southWest = L.latLng(37.7072, -122.5868);
var northEast = L.latLng(37.8339, -122.3554);
var bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map', MAP_ID, {
  maxBounds: bounds,
  maxZoom: 20,
  minZoom: 13,
  attributionControl: false
});

map
  .fitBounds(bounds)
  .setView([37.778, -122.426], 13);

$('select').selectpicker({
  style: 'btn-default'
});

var date = new Date();
$('#time').val(date.getHours() + ':' + date.getMinutes());

$('.clockpicker').clockpicker({
  autoclose: true,
  placement: 'bottom',
  twelvehour: true
});

function loadHeatMap() {
  var queryString = $('form :input')
    .filter(function(index, element) {
      return $(element).val() != '';
    })
    .serialize();
  var url = DATA_ENDPOINT;

  if (queryString != '') {
    url += '?' + queryString;
  }

  $.ajax({
      url: url,
      beforeSend: function(request) {
        request.setRequestHeader('X-App-Token', APP_TOKEN);
      }
    })
    .done(function(response) {
      console.log(response);
    });
}

loadHeatMap();

$('#view').on('click', loadHeatMap);
