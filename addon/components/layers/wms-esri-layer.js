import Ember from 'ember';
import WMSLayerComponent from 'ember-flexberry-gis/components/layers/wms-layer';
import EsriDynamycLayerComponent from './esri-dynamic-layer';

/**
  WMS Esri component for leaflet map.

  @class WmsEsriLayerComponent
  @extends WMSLayerComponent
 */
export default WMSLayerComponent.extend({
  /**
    Inner ESRI dynamic layer.
    Needed for identification (always invisible, won't be added to map).

    @property _esriDynamicLayer
  */
  _esriDynamicLayer: null,

  /**
   Url of ArcGIS REST service endpoint
  */
  restUrl: null,

  /**
     Handles 'flexberry-map:identify' event of leaflet map.

     @method identify
     @param {Object} e Event object.
     @param {<a href="http://leafletjs.com/reference-1.0.0.html#latlngbounds">L.LatLngBounds</a>} options.boundingBox Bounds of identification area.
     @param {<a href="http://leafletjs.com/reference-1.0.0.html#latlng">L.LatLng</a>} e.latlng Center of the bounding box.
     @param {Object[]} layers Objects describing those layers which must be identified.
     @param {Object[]} results Objects describing identification results.
     Every result-object has the following structure: { layer: ..., features: [...] },
     where 'layer' is metadata of layer related to identification result, features is array
     containing (GeoJSON feature-objects)[http://geojson.org/geojson-spec.html#feature-objects]
     or a promise returning such array.
   */
  identify(e) {
    let innerEsriDynamicLayer = this.get('_esriDynamicLayer');
    if (!Ember.isNone(innerEsriDynamicLayer)) {
      innerEsriDynamicLayer.identify.apply(innerEsriDynamicLayer, arguments);
    }
  },

  query(e) {
    let innerEsriDynamicLayer = this.get('_esriDynamicLayer');
    if (!Ember.isNone(innerEsriDynamicLayer)) {
      innerEsriDynamicLayer.query.apply(innerEsriDynamicLayer, arguments);
    }
  },

  /**
    Handles 'flexberry-map:search' event of leaflet map.

    @method search
    @param {Object} e Event object.
    @param {<a href="http://leafletjs.com/reference-1.0.0.html#latlng">L.LatLng</a>} e.latlng Center of the search area.
    @param {Object[]} layer Object describing layer that must be searched.
    @param {Object} searchOptions Search options related to layer type.
    @param {Object} results Hash containing search results.
    @param {Object[]} results.features Array containing (GeoJSON feature-objects)[http://geojson.org/geojson-spec.html#feature-objects]
    or a promise returning such array.
  */
  search(e) {
    let innerEsriDynamicLayer = this.get('_esriDynamicLayer');
    if (!Ember.isNone(innerEsriDynamicLayer)) {
      return innerEsriDynamicLayer.search.apply(innerEsriDynamicLayer, arguments);
    }
  },

  /**
    Initializes component.
  */
  init() {
    this._super(...arguments);

    let innerEsriDynamicLayerProperties = {
      layerModel: this.get('layerModel'),
      crs: this.get('crs'),
      restUrl: this.get('restUrl'),
      esriLayers: this.get('esriLayers')
    };

    // Set creating component's owner to avoid possible lookup exceptions.
    let owner = Ember.getOwner(this);
    let ownerKey = null;
    Ember.A(Object.keys(this) || []).forEach((key) => {
      if (this[key] === owner) {
        ownerKey = key;
        return false;
      }
    });
    if (!Ember.isBlank(ownerKey)) {
      innerEsriDynamicLayerProperties[ownerKey] = owner;
    }

    // Create inner ESRI dynamic layer which is needed for identification (always invisible, won't be added to map).
    this.set('_esriDynamicLayer', EsriDynamycLayerComponent.create(innerEsriDynamicLayerProperties));
  },

  /**
    Destroys component.
  */
  willDestroyElement() {
    this._super(...arguments);

    let innerEsriDynamicLayer = this.get('_esriDynamicLayer');
    if (!Ember.isNone(innerEsriDynamicLayer)) {
      innerEsriDynamicLayer.destroy();
      this.set('_esriDynamicLayer', null);
    }
  }
});