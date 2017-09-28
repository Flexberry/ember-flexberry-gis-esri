/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flexberry-gis-esri',

  included: function (app) {
    this._super.included.apply(this._super, arguments);

    app.import(app.bowerDirectory + '/esri-leaflet/dist/esri-leaflet-debug.js');

    // Extended L.esri.DynamicMapLayer
    app.import('vendor/esri-leaflet-raster-layer-extended.js');
  }
};
