import esriDynamicDialog from './components/map-commands-dialog/search-settings/esri-dynamic';
import wmsEsriDialog from './components/map-commands-dialog/search-settings/wms-esri';
import esriDynamicLegend from './components/legends/esri-dynamic';
import esriDynamicSettings from './components/layers-dialogs/settings/esri-dynamic';
import esriTileSettings from './components/layers-dialogs/settings/esri-tile';
import wmsEsriSettings from './components/layers-dialogs/settings/wms-esri';

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
    },
    'layers-dialogs': {
      'settings': {
        'esri-dynamic': esriDynamicSettings,
        'esri-tile': esriTileSettings,
        'wms-esri': wmsEsriSettings
      }
    }
  }
};
