import Ember from 'ember';
import WMSLayer from 'ember-flexberry-gis/components/layers/wms-layer';

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

export default WMSLayer.extend({
  /**
    Url of ArcGIS REST service endpoint
   */
  restUrl: null,

  layersIds: Ember.computed('restUrl', function () {
    let params = {
      f: 'json'
    };

    let url = this.get('restUrl');
    url = url + L.Util.getParamString(params, url);

    return new Ember.RSVP.Promise((resolve, reject) => {

      Ember.$.ajax({
        url,
        success: function (data) {
          let result = JSON.parse(data);
          resolve(result.layers.filter(layer => !layer.subLayerIds).map(layer => layer.id));
        },
        error: function () {
          reject();
        }
      });
    });
  }),

  _queryLayer(layerId, params) {
    params = Ember.$.extend(true, params, { f: 'json' });
    return new Ember.RSVP.Promise((resolve, reject) => {
      let url = this.get('restUrl') + '/' + layerId + '/query';
      let crs = this.get('crs');
      url = url + L.Util.getParamString(params, url);

      Ember.$.ajax({
        url,
        success: function (data) {
          let result = JSON.parse(data);
          if (result.error) {
            reject(result.error);
            return;
          }

          let featureCollection = L.esri.Util.responseToFeatureCollection(result);
          let coordsToLatLng = function (coords) {
            var point = L.point(coords[0], coords[1]);
            var ll = crs.projection.unproject(point);
            if (coords[2]) {
              ll.alt = coords[2];
            }

            return ll;
          };

          resolve(L.geoJSON(featureCollection, {
            coordsToLatLng
          }));
        },
        error: function (e) {
          reject(e);
        }
      });
    });
  },

  _query(e) {
    let layerId = this.get('layerModel.id').toString();
    let layerLinks = e.layerLinks.filter(link => link.get('layerModel.id').toString() === layerId);
    if (!layerLinks.length) {
      return;
    }

    let queryFilter = e.queryFilter;

    e.results.push(new Ember.RSVP.Promise((resolve, reject) => {
      let result = L.featureGroup();

      this.get('layersIds')
        .then(layerIds => {
          let allQueries = [];
          layerIds.forEach((layerId) => {
            layerLinks.forEach((link) => {
              let params =
                {
                  where: link.get('linkParameter').map(link => link.get('layerField') + '=' + queryFilter[link.get('queryKey')]).join(' and ')
                };

              allQueries.push(this._queryLayer(layerId, params));
            });
          });

          Ember.RSVP.all(allQueries).then(layers => {
            layers.forEach(layer => result.addLayer(layer));
            resolve(result);
          });
        })
        .catch((error) => { reject(error); });
    }));
  },

  didInsertElement() {
    this._super(...arguments);
    this.get('leafletMap').on('flexberry-map:query', this._query, this);
  },

  _identifyEsri(boundingBox) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let url = this.get('restUrl') + '/identify';
      let crs = this.get('crs');
      let map = this.get('leafletMap');
      let size = map.getSize();

      let params = {
        f: 'json',
        geometryType: 'esriGeometryEnvelope',
        layers: 'visible',
        returnGeometry: true,
        tolerance: 5,
        geometry: projectBounds(boundingBox, crs),
        imageDisplay: [size.x, size.y, 96],
        mapExtent: projectBounds(map.getBounds(), crs)
      };

      url = url + L.Util.getParamString(params, url);

      let _this = this;

      Ember.$.ajax({
        url,
        success: function (data) {
          if (!Ember.isNone(data.error) && data.error) {
            resolve(Ember.A([]));
          } else {
            let result = JSON.parse(data);
            let featureCollection = L.esri.Util.responseToFeatureCollection(result);
            _this.injectLeafletLayersIntoGeoJSON(featureCollection);
            resolve(Ember.A(Ember.get(featureCollection, 'features') || []));
          }
        },
        error: function (e) {
          reject(e);
        }
      });
    });
  },

  identify(e) {
    let featuresPromise = this._identifyEsri(e.boundingBox);
    e.results.push({
      layer: this.get('layerModel'),
      features: featuresPromise
    });
  },

  search(e) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('layersIds')
        .then(layerIds => {
          let allQueries = [];
          layerIds.forEach((layerId) => {
            let queryProperties = { outFields: '*' };
            let searchFields = this.get('searchSettings.searchFields');
            if (Ember.isNone(searchFields)) {
              queryProperties.text = typeof (e.prepareQueryString) === 'function' ? e.prepareQueryString(e.searchOptions.queryString) : e.searchOptions.queryString.replace(/ /g, '%');
            } else {
              let whereClause = [];
              searchFields.split(',').forEach(function (field) {
                whereClause.push(field + ' like \'' + (typeof (e.prepareQueryString) === 'function' ? e.prepareQueryString(e.searchOptions.queryString) : '%' + e.searchOptions.queryString.replace(/ /g, '%') + '%') + '\'');
              });

              queryProperties.where = whereClause.join(' OR ');
            }

            allQueries.push(this._queryLayer(layerId, queryProperties));
          });

          Ember.RSVP.all(allQueries).then(featureLayers => {
            let features = Ember.A();
            featureLayers.forEach(featureLayer => {
              featureLayer.eachLayer(layer => {
                let feature = layer.feature;
                feature.leafletLayer = layer;
                features.push(feature);
              });
            });

            resolve(features);
          },
            (error) => {
              reject(error);
            });
        })
        .catch((error) => { reject(error); });
    });
  }
});
