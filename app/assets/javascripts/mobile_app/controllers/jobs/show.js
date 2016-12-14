Travis.Controllers.Jobs.Show = Ember.Object.create({
  repositoryBinding: 'Travis.Controllers.Builds.List.repository',
  content: function() {
    var build_id = this.getPath('Travis.params.id');
    if (build_id) {
      if (build_id == this.get('job_id')) {
        return this.get('job');
      }
      var build = Travis.Job.find(this.getPath('Travis.params.id'));
      // A hack, but "necessary" to get all the attributes (just not the stuff
      // listen in /builds.
      build.refresh();
      this.set('job', build);
      this.set('job_id', build.get('id'));
      return build;
    } else {
      return undefined;
    }
  }.property('Travis.params')
});
