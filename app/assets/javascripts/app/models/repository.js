Travis.Repository = Travis.Record.extend(Travis.Helpers.Common, {
  slug:                SC.Record.attr(String),
  name:                SC.Record.attr(String, { key: 'name' }),
  owner:               SC.Record.attr(String, { key: 'owner_name' }),
  lastBuildId:         SC.Record.attr(Number, { key: 'last_build_id' }),
  lastBuildNumber:     SC.Record.attr(String, { key: 'last_build_number' }),
  lastBuildResult:     SC.Record.attr(Number, { key: 'last_build_result' }),
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
    if(window.__DEBUG__) console.log('updating builds on repository ' + this.get('id'));
    return Travis.Build.byRepositoryId(this.get('id'));
  }.property().cacheable(),

  lastBuild: function() {
    if(window.__DEBUG__) console.log('updating lastBuild on repository ' + this.get('id'));
    return Travis.Build.find(this.get('lastBuildId'));
  }.property('lastBuildId'),

  lastBuildDuration: function() {
    if(window.__DEBUG__) console.log('updating lastBuildDuration on repository ' + this.get('id'));
    return this.durationFrom(this.get('lastBuildStartedAt'), this.get('lastBuildFinishedAt'));
  }.property('lastBuildStartedAt', 'lastBuildFinishedAt').cacheable(),

  // TODO the following display logic all all seems to belong to a controller or helper module,
  // but I can't find a way to bind an itemClass to a controller w/ a CollectionView

  color: function() {
    if(window.__DEBUG__) console.log('updating color on repository ' + this.get('id'));
    return this.colorForStatus(this.get('lastBuildResult'));
  }.property('lastBuildResult').cacheable(),

  formattedLastBuildDuration: function() {
    if(window.__DEBUG__) console.log('updating formattedLastBuildDuration on repository ' + this.get('id'));
    return this.readableTime(this.get('lastBuildDuration'));
  }.property('lastBuildDuration').cacheable(),

  formattedLastBuildFinishedAt: function() {
    if(window.__DEBUG__) console.log('updating formattedLastBuildFinishedAt on repository ' + this.get('id'));
    return this.timeAgoInWords(this.get('lastBuildFinishedAt')) || '-';
  }.property('lastBuildFinishedAt').cacheable(),

  cssClasses: function() { // ugh
    if(window.__DEBUG__) console.log('updating cssClasses on repository ' + this.get('id'));
    return $.compact(['repository', this.get('color'), this.get('selected') ? 'selected' : null]).join(' ');
  }.property('color', 'selected').cacheable(),
});

Travis.Repository.reopenClass({
  resource: 'repositories',

  recent: function() {
    return this.all({ orderBy: 'lastBuildStartedAt DESC' });
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
  },
});
