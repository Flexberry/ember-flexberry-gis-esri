/*jshint node:true*/
module.exports = {

  afterInstall: function (options) {
    return this.addBowerPackagesToProject([
      { name: 'esri-leaflet', source: 'https://github.com/Esri/esri-leaflet#^2.0.3' },
      { name: 'leaflet.wms', source: 'https://github.com/Flexberry/leaflet.wms#gh-pages' }]);
  }
};
