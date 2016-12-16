/*jshint node:true*/
module.exports = {

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([
      'https://github.com/Esri/esri-leaflet#^2.0.3',
    ]);
  }
};
