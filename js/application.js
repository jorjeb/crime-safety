'use strict';

L.mapbox.accessToken = 'pk.eyJ1Ijoiam9yamViYXJyZXJhIiwiYSI6IklWa1JXM1EifQ.BJDcoEfnAsKO7CMvT7CaIw';

var southWest = L.latLng(37.7072, -122.5868);
var northEast = L.latLng(37.8339, -122.3554);
var bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map', 'jorjebarrera.jlk69o32', {
  maxBounds: bounds,
  maxZoom: 20,
  minZoom: 13,
  attributionControl: false
});

map
  .fitBounds(bounds)
  .setView([37.778, -122.426], 13);
