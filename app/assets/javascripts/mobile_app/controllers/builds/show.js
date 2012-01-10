Travis.Controllers.Builds.Show = Ember.Object.extend({
  repositoryBinding: '_repositories.firstObject',

  init: function() {
    this._super();

    this.set('params', Travis.main.get('params'));

    var build = Travis.store.find(Travis.Build, this.getPath('params.id'));
    console.log(build);
    this.set('build', build);

    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      contentBinding: 'controller.build',
      jobsBinding: 'controller.jobs',
      templateName: 'mobile_app/templates/builds/show'
    });
  },

  destroy: function() {
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
