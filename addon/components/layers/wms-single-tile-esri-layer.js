import Ember from 'ember';
import WMSEsriLayer from './wms-esri-layer';

let projectBounds = function (boundingBox, crs) {
  let sw = crs.project(boundingBox.getSouthWest());
  let ne = crs.project(boundingBox.getNorthEast());

  return [
    sw.x,
    sw.y,
    ne.x,
    ne.y
  ];
};

export default WMSEsriLayer.extend({
  /**
    Creates leaflet layer related to layer type.

    @method createLayer
  */
  createLayer() {
    return L.wms.overlay(this.get('url'), this.get('options'));
  },
});
