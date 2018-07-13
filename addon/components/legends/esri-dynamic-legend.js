import Ember from 'ember';
import BaseLegendComponent from 'ember-flexberry-gis/components/legends/-private/base-legend';
import layout from '../../templates/components/legends/esri-dynamic-legend';

/**
  Component representing map layer's legend for Esri-dynamic-layers.

  @class EsriDynamicLegendComponent
  @extends BaseLegendComponent
*/
export default BaseLegendComponent.extend({
  /**
    Reference to component's template.
  */
  layout,

  /**
    Array of legend's for layer.
    Every legend is an object with following structure { src: ... },
    Where 'src' is legend's image source (url or base64-string).

    @property _legends
    @type Object[]
    @private
    @readOnly
  */
  _legends: Ember.computed(
    'layerSettings.url',
    'layerSettings.legendSettings.url',
    'layerSettings.legendSettings.layers',
    function () {

      let legends = Ember.A();

      let restUrl = this.get('layerSettings.legendSettings.url') || this.get('layerSettings.url') || '';
      if (Ember.isBlank(restUrl)) {
        Ember.Logger.error(
          `Unable to compute legends for '${this.get('name')}' layer, because both required settings 'restUrl' and 'legendSettings.restUrl' are blank`);
        return legends;
      }

      let url = restUrl + '/legend';
      let params = {
        f: 'json'
      };

      url = url + L.Util.getParamString(params, url);

      // Track changes only on explicitly defined layers.
      let layersIncluded = Ember.A((this.get('layerSettings.legendSettings.layers') || '').split(',')).filter(layerName => !Ember.isBlank(layerName));

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
              reject('Request to ' + url + ' returned result with no layers');
            }

            // Filter layers via defined legendSettings.layers list.
            if (layersIncluded && layersIncluded.length > 0) {
              result.layers = result.layers.filter(layer => layersIncluded.indexOf(layer.layerName) !== -1);
            }

            result.layers.forEach((layer) => {
              let id = layer.layerId;

              // Legend contains many images.
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
          error: function (jqXHR) {
            reject(jqXHR);
          }
        });
      });

    }),

  didInsertElement() {
    this._super(...arguments);
    this.$('.flexberry-progressbar').progress();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$('.flexberry-progressbar').progress('destroy');
  }
});
