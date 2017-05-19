import Ember from 'ember';
import WmsLegendComponent from 'ember-flexberry-gis/components/legends/wms-legend';
import layout from '../../templates/components/legends/esri-dynamic-legend';

/**
  Component representing map layer's legend for Esri-dynamic-layers.

  @class EsriDynamicLegendComponent
  @extends WmsLegendComponent
*/
export default WmsLegendComponent.extend({
  /**
    Reference to component's template.
  */
  layout,

  /**
    Flag: indicates whether to show layer name or not.

    @property showLayerName
    @type Boolean
    @default true
  */
  showLayerName: true,

  /**
    Array of legend's for layer.
    Every legend is an object with following structure { src: ... },
    where 'src' is legend's image source (url or base64-string).

    @property _legends
    @type Object[]
    @private
    @readOnly
  */
  _legends: Ember.computed(
    'layerSettings.legendSettings.url',
    'layerSettings.legendSettings.layers',
    function () {
      // if url of a service for legend is explicit - get legend as for WMS
      if (!Ember.isBlank(this.get('layerSettings.legendSettings.url'))) {
        // do not show layer name because it is already on image of WMS legend
        this.set('showLayerName', false);

        return this._super(...arguments);
      }

      // track changes only on explicitly defined layers
      let layersIncluded = Ember.A((this.get('layerSettings.legendSettings.layers') || '').split(',')).filter(layerName => !Ember.isBlank(layerName));

      let restUrl = this.get('layerSettings.restUrl');
      let url = restUrl + '/legend';
      let params = {
        f: 'json'
      };

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

            if (Ember.isNone(result.layers) || result.layers.length === 0) {
              reject();
            }

            // filter layers via defined legendSettings.layers list
            if (layersIncluded && layersIncluded.length > 0) {
              result.layers = result.layers.filter(layer => layersIncluded.indexOf(layer.layerName) !== -1);
            }

            let legends = Ember.A();

            result.layers.forEach((layer) => {
              let id = layer.layerId;

              // legend contain many images
              layer.legend.forEach((legend) => {
                let imageUrl = legend.url;

                legends.pushObject({
                  src: `${restUrl}/${id}/images/${imageUrl}`,
                  layerName: !Ember.isEmpty(legend.label) ? legend.label : layer.layerName
                });
              });
            });

            resolve(legends);
          },
          error: function () {
            reject();
          }
        });
      });

    })
});
