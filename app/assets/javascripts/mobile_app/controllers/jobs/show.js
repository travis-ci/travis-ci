Travis.Controllers.Jobs.Show = Ember.Object.extend({
  repositoryBinding: '_repositories.firstObject',

  init: function() {
    this._super();

    this.set('params', Travis.main.get('params'));

    var job = Travis.store.find(Travis.Job, this.getPath('params.id'));
    this.set('job', job);

    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      contentBinding: 'controller.job',
      templateName: 'mobile_app/templates/jobs/show'
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
