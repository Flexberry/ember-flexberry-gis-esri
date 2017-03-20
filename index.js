/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flexberry-gis-esri',

  included: function (app) {
    this._super.included.apply(this._super, arguments);

    app.import(app.bowerDirectory + '/esri-leaflet/dist/esri-leaflet-debug.js');

    // Leaflet.WMS.
    app.import(app.bowerDirectory + '/leaflet.wms/dist/leaflet.wms.js');
  }
};
