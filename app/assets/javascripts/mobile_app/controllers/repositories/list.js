Travis.Controllers.Repositories.List = Ember.ArrayController.extend({
  init: function() {
    this._super();

    this.view = Ember.View.create({
      repositories: this,
      templateName: 'mobile_app/templates/repositories/list'
    });

    this.recent();
  },

  recent: function() {
    this.set('content', Travis.Repository.recent());
  },

  activate: function(page, params) {
    this.set('params', params);
    this.pageManager.activate(page);
  }
});
