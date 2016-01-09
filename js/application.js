'use strict';

var ACCESS_TOKEN = 'pk.eyJ1Ijoiam9yamViYXJyZXJhIiwiYSI6IklWa1JXM1EifQ.BJDcoEfnAsKO7CMvT7CaIw';
var MAP_ID = 'jorjebarrera.jlk69o32';
var DATA_ENDPOINT = 'https://data.sfgov.org/resource/cuks-n6tp.json';
var CATEGORY_ENDPOINT = DATA_ENDPOINT + '?$select=category&$group=category';
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

$('.clockpicker').clockpicker({
  autoclose: true,
  placement: 'bottom',
  twelvehour: true
});

var heatLayer = null;
var popupLayer = null;

function attachInfo(data) {
  return [
    '<dl>',
      '<dt>Category</dt>',
      '<dd>' + data.category + '</dd>',
      '<dt>Description</dt>',
      '<dd>' + data.descript + '</dd>',
      '<dt>Address</dt>',
      '<dd>' + data.address + '</dd>',
      '<dt>Resolution</dt>',
      '<dd>' + data.resolution + '</dd>',
      '<dt>Date</dt>',
      '<dd>' + moment(data.date).format('MMMM DD, YYYY') + '</dd>',
      '<dt>Day of the Week</dt>',
      '<dd>' + data.dayofweek + '</dd>',
      '<dt>Time</dt>',
      '<dd>' + moment(data.time, 'hh:mm').format('hh:mm A') + '</dd>',
    '</dl>'].join('');
}

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

        $('#map-wrapper').spin({
          color: '#828282'
        });
      }
    })
    .done(function(response) {
      if (heatLayer !== null) {
        map.removeLayer(heatLayer);
      }

      if (popupLayer !== null) {
        map.removeLayer(popupLayer);
      }
      
      heatLayer = L.heatLayer([], { 
          maxZoom: 12 
        });

      popupLayer = L.layerGroup();  

      if ($('#show-heat-map-layer').is(':checked')) {
        heatLayer.addTo(map);
      }

      if ($('#show-markers').is(':checked')) {
        popupLayer.addTo(map);
      }

      for (var i = 0; i < response.length; i++) {
        var latLng = new L.latLng(
          response[i].location.coordinates[1], 
          response[i].location.coordinates[0]
        );
        var marker = new L.marker([
            response[i].location.coordinates[1], 
            response[i].location.coordinates[0]
          ])
          .bindPopup(attachInfo(response[i]));

        popupLayer.addLayer(marker);

        heatLayer.addLatLng(latLng);

        $('#map-wrapper').spin(false);
      }
    });
}

$('#map-wrapper').spin({
  color: '#828282'
});

$.get(CATEGORY_ENDPOINT)
  .done(function(response) {
    var select = $('#category');

    for (var i = 0; i < response.length; i++) {
      select.append('<option value="' + response[i].category + '">' + response[i].category + '</option>');
    }

    $('select').selectpicker('refresh');

    loadHeatMap();
  });

$('#view').on('click', loadHeatMap);

$('#show-heat-map-layer').on('click', function() {
  if ($(this).is(':checked')) {
    heatLayer.addTo(map);
  } else {
    map.removeLayer(heatLayer);
  }
});

$('#show-markers').on('click', function() {
  if ($(this).is(':checked')) {
    popupLayer.addTo(map);
  } else {
    map.removeLayer(popupLayer);
  }
});
