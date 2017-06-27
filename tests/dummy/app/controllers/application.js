import Ember from 'ember';
import config from '../config/environment';

const version = config.APP.version;

/**
  Application controller.

  @class ApplicationController
  @extends <a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>
*/
export default Ember.Controller.extend({
  actions: {
    /**
      Toggles application sitemap's side bar.

      @method actions.toggleSidebar
    */
    toggleSidebar() {
      Ember.$('.ui.sidebar').sidebar('toggle');
    }
  },

  /**
    Currernt addon version.

    @property addonVersion
    @type String
  */
  addonVersion: version,

  /**
    Link to GitHub commit related to current addon version.

    @property addonVersionHref
    @type String
  */
  addonVersionHref: Ember.computed('addonVersion', function() {
    let addonVersion = this.get('addonVersion');
    let commitSha = addonVersion.split('+')[1];

    return 'https://github.com/Flexberry/ember-flexberry-gis-esri/commit/' + commitSha;
  }),

  /**
    Flag: indicates whether current browser is internet explorer.

    @property browserIsInternetExplorer
    @type Boolean
  */
  browserIsInternetExplorer: Ember.computed(function() {
    let userAgent = window.navigator.userAgent;

    return userAgent.indexOf('MSIE ') > 0 || userAgent.indexOf('Trident/') > 0 || userAgent.indexOf('Edge/') > 0;
  }),

  /**
    Locales supported by application.

    @property locales
    @type String[]
    @default ['ru', 'en']
  */
  locales: ['ru', 'en'],

  /**
    Initializes controller.
  */
  init() {
    this._super(...arguments);

    let i18n = this.get('i18n');
    if (Ember.isNone(i18n)) {
      return;
    }

    // If i18n.locale is long value like 'ru-RU', 'en-GB', ... this code will return short variant 'ru', 'en', etc.
    let shortCurrentLocale = this.get('i18n.locale').split('-')[0];
    let availableLocales = Ember.A(this.get('locales'));

    // Force current locale to be one of available,
    // if browser's current language is not supported by dummy application,
    // or if browser's current locale is long value like 'ru-RU', 'en-GB', etc.
    if (!availableLocales.contains(shortCurrentLocale)) {
      i18n.set('locale', 'en');
    } else {
      i18n.set('locale', shortCurrentLocale);
    }
  },

  /**
    Application sitemap.

    @property sitemap
    @type Object
  */
  sitemap: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');

    return {
      nodes: [{
        link: 'index',
        caption: i18n.t('forms.application.sitemap.index.caption'),
        title: i18n.t('forms.application.sitemap.index.title'),
        children: null
      }, {
        link: null,
        caption: i18n.t('forms.application.sitemap.gis.caption'),
        title: i18n.t('forms.application.sitemap.gis.title'),
        children: [{
          link: 'map',
          caption: i18n.t('forms.application.sitemap.gis.map.caption'),
          title: i18n.t('forms.application.sitemap.gis.map.title'),
          children: null
        }]
      }]
    };
  })
});
