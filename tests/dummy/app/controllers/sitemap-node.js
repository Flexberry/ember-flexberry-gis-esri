import Ember from 'ember';

/**
  Controller for 'site-map-node' view from 'ember-flexberry' addon.

  @class SitemapNodeController
  @extends <a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>
*/
export default Ember.Controller.extend({
  actions: {
    /**
       Hides application sitemap's side bar.

       @method actions.hideSidebar
     */
    hideSidebar: function() {
      Ember.$('.ui.sidebar').sidebar('hide');
    },

    /**
  Expand menu items by click.
  @method actions.subMenuEl
*/
subMenuEl(event) {
  let $this = Ember.$(event.currentTarget).parent().find('.subMenu:first');
  if ($this.hasClass('hidden')) {
    $this.removeClass('hidden');
    Ember.$(event.target).parent().find('.item-minus:first').removeClass('hidden');
    Ember.$(event.target).parent().find('.item-plus:first').addClass('hidden');
  } else {
    $this.addClass('hidden');
    Ember.$(event.target).parent().find('.item-minus:first').addClass('hidden');
    Ember.$(event.target).parent().find('.item-plus:first').removeClass('hidden');
  }
}
  }
});
