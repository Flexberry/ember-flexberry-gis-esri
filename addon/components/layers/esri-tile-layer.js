import BaseLayer from 'ember-flexberry-gis/components/base-layer';

export default BaseLayer.extend({
  /**
    Whether the layer is wrapped around the antimeridian.
    (not wrapped if true)

    @property noWrap
    @type Boolean
    @default true
  */
  noWrap: true,

  leafletOptions: [
    'minZoom', 'maxZoom', 'maxNativeZoom', 'tileSize', 'subdomains',
    'errorTileUrl', 'attribution', 'tms', 'continuousWorld', 'noWrap',
    'zoomOffset', 'zoomReverse', 'opacity', 'zIndex', 'unloadInvisibleTiles',
    'updateWhenIdle', 'detectRetina', 'reuseTiles', 'bounds',

    // esri tile options
    'url', 'zoomOffsetAllowance', 'proxy', 'useCors', 'token'
  ],

  /**
    Creates leaflet layer related to layer type.

    @method createLayer
  */
  createLayer() {
    return L.esri.tiledMapLayer(this.get('options'));
  },

  identify() {
    // Tile-layers hasn't any identify logic.
  }
});
