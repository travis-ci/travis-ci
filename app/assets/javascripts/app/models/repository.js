Travis.Repository = Travis.Record.extend(Travis.Helpers.Common, {
  slug:                SC.Record.attr(String),
  name:                SC.Record.attr(String, { key: 'name' }),
  owner:               SC.Record.attr(String, { key: 'owner_name' }),
  lastBuildId:         SC.Record.attr(Number, { key: 'last_build_id' }),
  lastBuildNumber:     SC.Record.attr(String, { key: 'last_build_number' }),
  lastBuildResult:     SC.Record.attr(Number, { key: 'last_build_result' }),
  lastBuildDuration:   SC.Record.attr(Number, { key: 'last_build_duration' }),
  lastBuildStartedAt:  SC.Record.attr(String, { key: 'last_build_started_at'  }),  // DateTime doesn't seem to work?
  lastBuildFinishedAt: SC.Record.attr(String, { key: 'last_build_finished_at' }),

  select: function() {
    this.whenReady(function(self) {
      Travis.Repository.select(self.get('id'))
    });
  },

  updateTimes: function() {
    this.notifyPropertyChange('lastBuildStartedAt');
    this.notifyPropertyChange('lastBuildFinishedAt');
  },

  builds: function() {
    return Travis.Build.byRepositoryId(this.get('id'));
  }.property().cacheable(),

  lastBuild: function() {
    return Travis.Build.find(this.get('lastBuildId'));
  }.property('last_build_id'),

  // VIEW HELPERS

  color: function() {
    return this.colorForStatus(this.get('lastBuildResult'));
  }.property('last_build_result').cacheable(),

  formattedLastBuildDuration: function() {
    return this.readableTime(this.get('lastBuildDuration'));
  }.property('lastBuildDuration').cacheable(),

  formattedLastBuildFinishedAt: function() {
    return this.timeAgoInWords(this.get('lastBuildFinishedAt')) || '-';
  }.property('lastBuildFinishedAt').cacheable(),

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
    return '#!/' + this.get('slug') + '/builds/' + this.get('lastBuildId');
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
});

Travis.Repository.reopenClass({
  resource: 'repositories',

  recent: function() {
    return this.all({ orderBy: 'lastBuildStartedAt DESC' });
  },

  owned_by: function(githubId) {
    return Travis.store.find(SC.Query.remote(Travis.Repository, { url: 'repositories.json?owner_name=' + githubId, orderBy: 'name' }));
  },

  search: function(search) {
    return Travis.store.find(SC.Query.remote(Travis.Repository, { url: 'repositories.json?search=' + search, orderBy: 'name' }));
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
