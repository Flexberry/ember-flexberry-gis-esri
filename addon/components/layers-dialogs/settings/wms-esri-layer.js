/**
  @module ember-flexberry-gis-esri
*/

import Ember from 'ember';
import layout from '../../../templates/components/layers-dialogs/settings/wms-esri-layer';

/**
  Settings-part of wms-esri-layer layer modal dialog.

  @class WmsEsriLayerSettingsComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Ember.Component.extend({

  /**
    Reference to component's template.
  */
  layout,

  /**
    Overridden ['tagName'](http://emberjs.com/api/classes/Ember.Component.html#property_tagName)
    is empty to disable component's wrapping <div>.

    @property tagName
    @type String
    @default ''
  */
  tagName: '',

  /**
    Editing layer deserialized type-related settings.

    @property settings
    @type Object
    @default null
  */
  settings: null
});
