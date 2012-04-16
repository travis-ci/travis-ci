Travis.Repository = Travis.Record.extend(Travis.Helpers.Common, {
  slug:                   Ember.Record.attr(String),
  name:                   Ember.Record.attr(String),
  owner:                  Ember.Record.attr(String),
  description:            Ember.Record.attr(String),
  last_build_id:          Ember.Record.attr(Number),
  last_build_number:      Ember.Record.attr(String),
  last_build_result:      Ember.Record.attr(Number),
  last_build_duration:    Ember.Record.attr(Number),
  last_build_started_at:  Ember.Record.attr(String),  // DateTime doesn't seem to work?
  last_build_finished_at: Ember.Record.attr(String),

  select: function() {
    this.whenReady(function(self) {
      Travis.Repository.select(self.get('id'))
    });
  },

  updateTimes: function() {
    this.notifyPropertyChange('last_build_duration');
    this.notifyPropertyChange('last_build_finished_at');
  },

  branchSummary: function() {
    builds = this.get('branch_summary');
    var p_slug = this.get('slug')
    $.each(builds, function(index, build) {
      build['formattedCommit'] = build.commit.substr(0,7);
      build['color'] = Travis.Helpers.Common.colorForResult(build.status);
      build['started_at'] = Travis.Helpers.Common.timeAgoInWords(build.started_at);
      build['finished_at'] = Travis.Helpers.Common.timeAgoInWords(build.finished_at);
      build['build_url'] = '#!/' + p_slug + '/builds/' + build.build_id;
      build['commit_url'] = 'http://github.com/' + p_slug + '/commit/' + build.commit;

    });
    return builds;
  }.property().cacheable(),

  builds: function() {
    return Travis.Build.pushesByRepositoryId(this.get('id'));
  }.property().cacheable(),

  pull_requests: function() {
    return Travis.Build.pullRequestsByRepositoryId(this.get('id'));
  }.property().cacheable(),

  lastBuild: function() {
    return Travis.Build.find(this.get('last_build_id'));
  }.property('last_build_id'),

  // VIEW HELPERS

  color: function() {
    return this.colorForResult(this.get('last_build_result'));
  }.property('last_build_result').cacheable(),

  formattedLastBuildDuration: function() {
    var duration = this.get('last_build_duration');
    if(!duration) duration = this.durationFrom(this.get('last_build_started_at'), this.get('last_build_finished_at'));
    return this.readableTime(duration);
  }.property('last_build_duration', 'last_build_started_at', 'last_build_finished_at'),

  formattedLastBuildFinishedAt: function() {
    return this.timeAgoInWords(this.get('last_build_finished_at')) || '-';
  }.property('last_build_finished_at'),

  cssClasses: function() { // ugh
    return $.compact(['repository', this.get('color'), this.get('selected') ? 'selected' : null]).join(' ');
  }.property('color', 'selected').cacheable(),

  urlCurrent: function() {
    return '#!/' + this.getPath('slug');
  }.property('slug').cacheable(),

  urlBuilds: function() {
    return '#!/' + this.get('slug') + '/builds';
  }.property('slug').cacheable(),

  urlLastBuild: function() {
    return '#!/' + this.get('slug') + '/builds/' + this.get('last_build_id');
  }.property('last_build_id').cacheable(),

  urlGithub: function() {
    return 'http://github.com/' + this.get('slug');
  }.property('slug').cacheable(),

  urlGithubWatchers: function() {
    return 'http://github.com/' + this.get('slug') + '/watchers';
  }.property('slug').cacheable(),

  urlGithubNetwork: function() {
    return 'http://github.com/' + this.get('slug') + '/network';
  }.property('slug').cacheable(),

  urlGithubAdmin: function() {
    return this.get('url') + '/admin/hooks#travis_minibucket';
  }.property('slug').cacheable(),

  urlBranches: function() {
    return '#!/' + this.get('slug') + '/branch_summary';
  }.property('slug').cacheable(),

  urlPullRequests: function() {
    return '#!/' + this.get('slug') + '/pull_requests';
  }.property('slug').cacheable(),

  urlStatusImage: function() {
    return this.get('slug') + '.png'
  }.property('slug').cacheable()

});

Travis.Repository.reopenClass({
  resource: 'repositories',

  recent: function() {
    return this.all({ orderBy: 'last_build_started_at DESC' });
  },

  owned_by: function(githubId) {
    return Travis.store.find(Ember.Query.remote(Travis.Repository, { url: 'repositories.json?owner_name=' + githubId, orderBy: 'name' }));
  },

  search: function(search) {
    return Travis.store.find(Ember.Query.remote(Travis.Repository, { url: 'repositories.json?search=' + search, orderBy: 'name' }));
  },

  bySlug: function(slug) {
    return this.all({ slug: slug });
  },

  select: function(id) {
    this.all().forEach(function(repository) {
      repository.whenReady(function() {
        repository.set('selected', repository.get('id') == id);
      });
    });
  }
});
