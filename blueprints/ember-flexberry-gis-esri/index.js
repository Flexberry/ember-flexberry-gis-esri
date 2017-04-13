/*jshint node:true*/
module.exports = {

  afterInstall: function (options) {
    return this.addBowerPackagesToProject([{ name: 'esri-leaflet', target: '^2.0.3' }]);
  }
};
