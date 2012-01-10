Travis.Controllers.Builds.List = Ember.ArrayController.extend({
  parent: null,
  repositoryBinding: '_repositories.firstObject',
  contentBinding: '_repositories.firstObject.builds',

  init: function() {
    this._super();

    this.set('params', Travis.main.get('params'));
    this.view = Ember.View.create({
      builds: this,
      repositoryBinding: 'builds.repository',
      templateName: 'mobile_app/templates/builds/list'
    });
  },

  destroy: function () {
    if (this.view) {
      this.view.$().remove();
      this.view.destroy();
    }
  },

  _repositories: function() {
    var slug = this.get('_slug');
    return slug ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
  }.property('_slug'),

  _slug: function() {
    var parts = $.compact([this.getPath('params.owner'), this.getPath('params.name')]);
    if(parts.length > 0) return parts.join('/');
  }.property('params')
});
