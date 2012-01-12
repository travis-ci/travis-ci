Travis.Controllers.Builds.List = Ember.ArrayController.create({
  repositoryBinding: '_repositories.firstObject',
  buildsBinding: 'repository.builds',

  lastStatus: function() {
    return 'status ' + this.getPath('builds.firstObject.color');
  }.property('builds.firstObject.color'),

  _repositories: function() {
    var slug = this.get('_slug');
    return slug ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
  }.property('_slug'),

  _slug: function() {
    var parts = $.compact([this.getPath('Travis.params.owner'), this.getPath('Travis.params.name')]);
    if(parts.length > 0) return parts.join('/');
  }.property('Travis.params')
});
