import esriDynamicDialog from './components/map-commands-dialog/search-settings/esri-dynamic';
import wmsEsriDialog from './components/map-commands-dialog/search-settings/wms-esri';
import esriDynamicLegend from './components/legends/esri-dynamic';

export default {
  'components': {
    'map-commands-dialogs': {
      'search-settings': {
        'esri-dynamic': esriDynamicDialog,
        'wms-esri': wmsEsriDialog,
      }
    },
    'legends': {
      'esri-dynamic': esriDynamicLegend
    }
  }
};
