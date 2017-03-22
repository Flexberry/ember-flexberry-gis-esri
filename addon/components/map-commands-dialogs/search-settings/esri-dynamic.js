import Ember from 'ember';
import layout from '../../../templates/components/map-commands-dialogs/search-settings/esri-dynamic';

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
    Editing layer deserialized search settings.

    @property settings
    @type Object
    @default null
  */
  settings: null,

  /**
    Map layer within which search must be executed.

    @property layer
    @type Object
    @default null
  */
  layer: null,

  /**
    Map layers hierarchy.

    @property layers
    @type Object[]
    @default null
  */
  layers: null,

  /**
    Leaflet map.

    @property leafletMap
    @type <a href="http://leafletjs.com/reference-1.0.0.html#map">L.Map</a>
    @default null
  */
  leafletMap: null
});
