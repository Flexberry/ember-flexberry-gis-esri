import Ember from 'ember';
import Wms from 'ember-flexberry-gis/locales/en/components/layers-dialogs/settings/wms';

const translations = {};
Ember.$.extend(true, translations, Wms);

Ember.$.extend(true, translations, {
  'restUrl-textbox': {
    'caption': 'restUrl'
  }
});

export default translations;
