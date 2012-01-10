Travis.Controllers.Repositories.Show = Ember.Object.extend({
  repositoryBinding: '_repositories.firstObject',
  buildBinding: '_buildProxy.content',

  init: function() {
    this._super();
    this.set('params', Travis.main.get('params'));
    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildBinding: 'controller.build',
      jobBinding: 'controller.job',
      templateName: 'mobile_app/templates/repositories/show'
    });
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
