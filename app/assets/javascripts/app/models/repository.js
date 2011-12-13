Travis.Repository = Travis.Record.extend(Travis.Helpers.Common, {
  slug:                   SC.Record.attr(String),
  name:                   SC.Record.attr(String),
  owner:                  SC.Record.attr(String),
  last_build_id:          SC.Record.attr(Number),
  last_build_number:      SC.Record.attr(String),
  last_build_result:      SC.Record.attr(Number),
  last_build_duration:    SC.Record.attr(Number),
  last_build_started_at:  SC.Record.attr(String),  // DateTime doesn't seem to work?
  last_build_finished_at: SC.Record.attr(String),

  select: function() {
    this.whenReady(function(self) {
      Travis.Repository.select(self.get('id'))
    });
  },

  updateTimes: function() {
    this.notifyPropertyChange('last_build_duration');
    this.notifyPropertyChange('last_build_finished_at');
  },

  builds: function() {
    return Travis.Build.byRepositoryId(this.get('id'));
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
    if(!duration) this.durationFrom(this.get('started_at'), this.get('finished_at'));
    return this.readableTime(duration);
  }.property('last_build_duration'),

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
});

Travis.Repository.reopenClass({
  resource: 'repositories',

  recent: function() {
    return this.all({ orderBy: 'last_build_started_at DESC' });
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
