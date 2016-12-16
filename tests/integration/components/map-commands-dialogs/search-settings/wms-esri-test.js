import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('map-commands-dialogs/search-settings/wms-esri', 'Integration | Component | map commands dialogs/search settings/wms esri', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{map-commands-dialogs/search-settings/wms-esri}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#map-commands-dialogs/search-settings/wms-esri}}
      template block text
    {{/map-commands-dialogs/search-settings/wms-esri}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
