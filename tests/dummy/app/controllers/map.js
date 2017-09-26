/**
  @module ember-flexberry-gis-esri-dummy
*/

import EditMapController from 'ember-flexberry-gis/controllers/edit-map';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
/**
  Map controller.

  @class MapController
  @extends EditMapController
*/
export default EditMapController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Parent route.

    @property parentRoute
    @type String
    @default 'index'
  */
  parentRoute: 'index'
});
