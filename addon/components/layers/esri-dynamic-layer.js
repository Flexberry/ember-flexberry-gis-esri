import Ember from 'ember';
import moment from 'moment';
import BaseLayerComponent from 'ember-flexberry-gis/components/base-layer';

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

/**
 * A polygon contains an array of rings and a spatialReference. Each ring is represented as an array of points.The first point of each ring is always the same as the last point.
 * And each point in the ring is represented as a 2-element array. The 0-index is the x-coordinate and the 1-index is the y-coordinate.
 * @method projectVertices
 * @param {<a href="http://leafletjs.com/reference.html#polygon">L.Polygon</a>} polygonLayer Polygon layer related to given area.
 * @param {Object} crs Coordinate reference system
 * @param {String} spatialReference The spatial reference can be specified using a well-known ID (wkid) or well-known text (wkt).
 * @return {Object} ArcGIS acceptable polygon geometry object
 * @example ''javascript
 * {
    "rings" : [ 
        [ [<x11>, <y11>], [<x12>, <y12>], ..., [<x11>, <y11>] ], 
        [ [<x21>, <y21>], [<x22>, <y22>], ..., [<x21>, <y21>] ]
        ],
        "spatialReference" : {<spatialReference>}
    }''
 */
let projectVertices = function (polygonLayer, crs, spatialReference) {
  let vertices = Ember.A();
  let polygonVertices = polygonLayer.getLatLngs().objectAt(0);

  polygonVertices.forEach((latlng) => {
    let point = crs.project(latlng);
    vertices.pushObject([point.x, point.y]);
  });

  // The first point of each ring is always the same as the last point.
  vertices.pushObject(vertices.objectAt(0));

  let geometry = {
    rings: [vertices]
  };

  if (spatialReference) {
    geometry.spatialReference = spatialReference;
  }

  return geometry;
};

/**
  Esri dynamic map layer component for leaflet map.

  @class EsriDynamicLayerComponent
  @extends BaseLayerComponent
 */
export default BaseLayerComponent.extend({
  leafletOptions: [
    'url', 'format', 'transparent', 'f', 'attribution', 'layers', 'layerDefs', 'opacity',
    'position', 'maxZoom', 'minZoom', 'dynamicLayers', 'token', 'proxy', 'useCors'
  ],

  /**
   Url of ArcGIS REST service endpoint
  */
  url: null,

  layersIds: Ember.computed('url', 'esriLayers', function () {
    let esriLayers = this.get('esriLayers');

    if (Ember.isArray(esriLayers) && esriLayers.length !== 0) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        resolve(esriLayers.map(layer => layer.id));
      });
    } else {
      let params = {
        f: 'json'
      };

      let url = this.get('url');
      url = url + L.Util.getParamString(params, url);

      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.$.ajax({
          url,
          success: function (data) {
            let result = {};
            try {
              result = JSON.parse(data);
            } catch (error) {
              reject(error);
            }

            if (result.error) {
              reject(result.error);
              return;
            }

            if (Ember.isNone(result.layers)) {
              reject();
            }

            resolve(result.layers.filter(layer => !layer.subLayerIds).map(layer => layer.id));
          },
          error: function () {
            reject();
          }
        });
      });
    }
  }),

  _queryLayer(layerId, params) {
    params = Ember.$.extend(true, params, {
      f: 'json'
    });
    return new Ember.RSVP.Promise((resolve, reject) => {
      let url = this.get('url') + '/' + layerId + '/query';
      let crs = this.get('crs');
      let dateFormat = this.get('displaySettings.dateFormat');
      url = url + L.Util.getParamString(params, url);

      Ember.$.ajax({
        url,
        success: function (data) {
          let result = {};
          try {
            result = JSON.parse(data);
          } catch (error) {
            reject(error);
          }

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

          let fields = result.fields;
          if (!Ember.isNone(fields) && !Ember.isNone(dateFormat)) {
            fields.forEach(function (field) {
              if (!Ember.isNone(field.type) && !Ember.isNone(field.name) && field.type === 'esriFieldTypeDate') {
                featureCollection.features.forEach(function (feature) {
                  if (!Ember.isNone(Ember.get(feature.properties, field.name))) {
                    let val = Ember.get(feature.properties, field.name);
                    let date = moment(new Date(val)).format(dateFormat);
                    Ember.set(feature.properties, field.name, date);
                  }
                });
              }
            });
          }

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

  query(e) {
    let layerLinks = this.get('layerModel.layerLink');
    if (!layerLinks.length || Ember.isBlank(layerLinks)) {
      return Ember.A();
    }

    let queryFilter = e.queryFilter;

    let featuresPromise = new Ember.RSVP.Promise((resolve, reject) => {
      let layerIdsPromise = this.get('layersIds');

      layerIdsPromise.then(layerIds => {
          let allQueries = [];
          layerIds.forEach((layerId) => {
            layerLinks.forEach((link) => {
              let linkParameters = link.get('linkParameter');

              if (Ember.isArray(linkParameters) && linkParameters.length > 0) {
                let conditions = Ember.A();

                linkParameters.forEach(linkParam => {
                  let property = queryFilter[linkParam.get('queryKey')];
                  let condition;
                  if (Ember.isArray(property)) {
                    let propertyValues = property.join(',');
                    condition = linkParam.get('layerField') + ' in ' + '(' + propertyValues + ')';
                  } else {
                    condition = linkParam.get('layerField') + '=' + property;
                  }

                  conditions.pushObject(condition);
                });
                let params = {
                  where: conditions.join(' and ')
                };
                allQueries.push(this._queryLayer(layerId, params));
              }
            });
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
        .catch((error) => {
          reject(error);
        });
    });

    return featuresPromise;
  },

  identify(e) {
    let featuresPromise = new Ember.RSVP.Promise((resolve, reject) => {
      let url = this.get('url') + '/identify';
      let crs = this.get('crs');
      let map = this.get('leafletMap');
      let size = map.getSize();

      let params = {
        f: 'json',
        geometryType: 'esriGeometryPolygon',
        layers: 'visible',
        returnGeometry: true,
        tolerance: 5,
        geometry: JSON.stringify(projectVertices(e.polygonLayer, crs)),
        imageDisplay: [size.x, size.y, 96],
        mapExtent: projectBounds(map.getBounds(), crs)
      };

      url = url + L.Util.getParamString(params, url);

      let self = this;

      Ember.$.ajax({
        url,
        success: function (data) {
          let result = JSON.parse(data);
          if (!Ember.isNone(result.error)) {
            reject(result.error);
          } else {
            let featureCollection = L.esri.Util.responseToFeatureCollection(result);
            self.injectLeafletLayersIntoGeoJSON(featureCollection);
            resolve(Ember.A(Ember.get(featureCollection, 'features') || []));
          }
        },
        error: function (e) {
          reject(e);
        }
      });
    });

    return featuresPromise;
  },

  search(e) {
    let featuresPromise = new Ember.RSVP.Promise((resolve, reject) => {
      let layerIdsPromise = this.get('layersIds');

      layerIdsPromise.then(layerIds => {
          let allQueries = [];
          layerIds.forEach((layerId) => {
            let queryProperties = {
              outFields: '*'
            };
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
        .catch((error) => {
          reject(error);
        });
    });

    return featuresPromise;
  },

  /**
    Creates leaflet layer related to layer type.

    @method createLayer
  */
  createLayer() {
    return L.esri.dynamicMapLayerExtended(this.get('options'));
  },
});
