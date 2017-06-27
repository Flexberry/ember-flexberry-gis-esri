import Ember from 'ember';
import EmberFlexberryTranslations from 'ember-flexberry/locales/en/translations';
import EmberFlexberryGisTranslations from 'ember-flexberry-gis/locales/en/translations';
import EmberFlexberryGisEsriTranslations from 'ember-flexberry-gis-esri/locales/en/translations';

const translations = {};
Ember.$.extend(true, translations, EmberFlexberryTranslations, EmberFlexberryGisTranslations, EmberFlexberryGisEsriTranslations);

Ember.$.extend(true, translations, {
  'application-name': 'Test stand for ember-flexberry-gis-esri',

  'forms': {
    'loading': {
      'spinner-caption': 'Loading data, please wait...'
    },
    'index': {
      'greeting': 'Welcome to ember-flexberry-gis-esri test stand!'
    },

    'application': {
      'header': {
        'menu': {
          'sitemap-button': {
            'caption': '',
            'title': 'Menu'
          },
          'user-settings-service-checkbox': {
            'caption': 'Use user settings service'
          },
          'language-dropdown': {
            'caption': 'Application language',
            'placeholder': 'Choose language'
          }
        }
      },

      'footer': {
        'application-name': 'Test stand for ember-flexberry-gis-esri',
        'application-version': {
          'caption': 'Addon version {{version}}',
          'title': 'It is version of ember-flexberry-gis-esri addon, which uses in this dummy application ' +
            '(npm version + commit sha). ' +
            'Click to open commit on GitHub.'
        }
      },

      'sitemap': {
        'application-name': {
          'caption': 'Test stand for ember-flexberry-gis-esri',
          'title': ''
        },
        'application-version': {
          'caption': 'Addon version {{version}}',
          'title': 'It is version of ember-flexberry-gis addon, which uses in this dummy application ' +
            '(npm version + commit sha). ' +
            'Click to open commit on GitHub.'
        },
        'index': {
          'caption': 'Home',
          'title': ''
        },
        'gis': {
          'caption': 'GIS',
          'title': '',
          'map': {
            'caption': 'Map',
            'title': ''
          }
        }
      }
    },

    'map': {
      'caption': 'Map'
    }
  }
});

export default translations;
