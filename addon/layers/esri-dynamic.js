import Ember from 'ember';
import BaseLayer from 'ember-flexberry-gis/layers/-private/base';

/**
  Class describing dynamic map layer metadata.

  @class DynamicLayer
*/
export default BaseLayer.extend({
  /**
    Icon class related to layer type.

    @property iconClass
    @type String
    @default 'image icon'
  */
  iconClass: 'image icon',

  /**
    Permitted operations related to layer type.

    @property operations
    @type String[]
    @default ['edit', 'remove', 'identify', 'search']
  */
  operations: ['edit', 'remove', 'identify', 'search'],

  /**
    Creates new settings object (with settings related to layer-type).

    @method createSettings
    @returns {Object} New settings object (with settings related to layer-type).
  */
  createSettings() {
    let settings = this._super(...arguments);
    Ember.$.extend(true, settings, {
      url: undefined,
    });

    return settings;
  },

  /**
   Creates new search settings object (with search settings related to layer-type).

   @method createSearchSettings
   @returns {Object} New search settings object (with search settings related to layer-type).
 */
  createSearchSettings() {
    let settings = this._super(...arguments);
    Ember.$.extend(true, settings, {
      queryString: '',
    });

    return settings;
  }
});
