/**
  @module ember-flexberry-gis-esri-dummy
*/

import Ember from 'ember';
import EditMapRoute from 'ember-flexberry-gis/routes/edit-map';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';

/**
  Map edit route.

  @class MapRoute
  @extends EditMapRoute
*/
export default EditMapRoute.extend(EditFormRouteOperationsIndicationMixin, {
  model() {
    let store = this.get('store');

    let esriTileLayer = this.store.createRecord('new-platform-flexberry-g-i-s-map-layer', {
      name: 'Esri tile layer',
      type: 'esri-tile',
      visibility: true,
      settings: '{"url":"https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer","showOnMinimap":true}',
      coordinateReferenceSystem: '{"code":"EPSG:3857","definition":null}',
      index: 0
    });

    let wmsEsrilayer = store.createRecord('new-platform-flexberry-g-i-s-map-layer', {
      type: 'wms-esri',
      name: 'Esri geocoder layer',
      visibility: true,
      coordinateReferenceSystem: '{"code":"EPSG:3857"}',
      settings: '{   "restUrl":"http://isogd/ArcGIS/rest/services/PCS/pcs_Ulica/MapServer",    "url":"http://isogd:8082/geowebcache/service/wms",    "version":"1.1.0",    "maxZoom":"25",    "format":"image/png",    "transparent":"true",    "layers":"pcs_Ulica",   "showOnMinimap":false,   "displaySettings":{    "dateFormat": "DD.MM.YYYY",    "featuresPropertiesSettings":{     "displayPropertyIsCallback":false,     "displayProperty":[],     "excludedProperties":[],     "localizedProperties":{      "ru":{}     }    }   },    "searchSettings":{    "canBeSearched":true,    "searchFields":null,    "canBeContextSearched":false,    "contextSearchFields":null   },   "identifySettings":{    "canBeIdentified":true   }  }',
      index: 1
    });

    let esriDynamicLayer = store.createRecord('new-platform-flexberry-g-i-s-map-layer', {
      type: 'esri-dynamic',
      name: 'Esri dynamic layer',
      visibility: true,
      coordinateReferenceSystem: '{"code":"EPSG:3857"}',
      settings: '{ "url":"https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer", "useCors":false, "showOnMinimap":false,   "displaySettings":{    "dateFormat": "DD.MM.YYYY",    "featuresPropertiesSettings":{     "displayPropertyIsCallback":false,     "displayProperty":[],     "excludedProperties":[],     "localizedProperties":{      "ru":{}     }    }   },    "searchSettings":{    "canBeSearched":true,    "searchFields":null,    "canBeContextSearched":false,    "contextSearchFields":null   },   "identifySettings":{    "canBeIdentified":true   }  }',
      index: 2
    });

    let map = store.createRecord('new-platform-flexberry-g-i-s-map', {
      name: 'testMap',
      zoom: 5,
      public: true,
      coordinateReferenceSystem: '{"code":"EPSG:3857"}',
      lat: 58,
      lng: 56.3,
      mapLayer: Ember.A([esriTileLayer, wmsEsrilayer, esriDynamicLayer])
    });

    return map;
  }
});
