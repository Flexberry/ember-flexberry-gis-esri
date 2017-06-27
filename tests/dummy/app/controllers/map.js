/**
  @module ember-flexberry-gis-esri-dummy
*/

import EditMapController from 'ember-flexberry-gis/controllers/edit-map';

/**
  Map controller.

  @class MapController
  @extends EditMapController
*/
export default EditMapController.extend({
  /**
    Parent route.

    @property parentRoute
    @type String
    @default 'index'
  */
  parentRoute: 'index'
});
