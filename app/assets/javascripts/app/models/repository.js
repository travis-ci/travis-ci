Travis.Repository = Travis.Record.extend(Travis.Helpers.Urls, Travis.Helpers.Common, {
  slug:                SC.Record.attr(String),
  name:                SC.Record.attr(String, { key: 'name' }),
  owner:               SC.Record.attr(String, { key: 'owner_name' }),
  lastBuildId:         SC.Record.attr(Number, { key: 'last_build_id' }),
  lastBuildNumber:     SC.Record.attr(String, { key: 'last_build_number' }),
  lastBuildStatus:     SC.Record.attr(Number, { key: 'last_build_status' }),
  lastBuildStartedAt:  SC.Record.attr(String, { key: 'last_build_started_at'  }),  // DateTime doesn't seem to work?
  lastBuildFinishedAt: SC.Record.attr(String, { key: 'last_build_finished_at' }),

  builds: function() {
    return Travis.Build.byRepositoryId(this.get('id'));
  }.property(),

  lastBuildDuration: function() {
    return this.durationFrom(this.get('lastBuildStartedAt'), this.get('lastBuildFinishedAt'));
  }.property('lastBuildStartedAt', 'lastBuildFinishedAt'),

  select: function() {
    this.whenReady(function(self) {
      Travis.Repository.select(self.get('id'))
    });
  },

  // TODO the following display logic all all seems to belong to a controller or helper module,
  // but I can't find a way to bind an itemClass to a controller w/ TemplateCollectionView

  color: function() {
    return this.colorForStatus(this.get('lastBuildStatus'));
  }.property('lastBuildStatus'),

  formattedLastBuildDuration: function() {
    return this.readableTime(this.get('lastBuildDuration'));
  }.property('lastBuildDuration'),

  formattedLastBuildFinishedAt: function() {
    return this.timeAgoInWords(this.get('lastBuildFinishedAt')) || '-';
  }.property('lastBuildFinishedAt'),

  cssClasses: function() {
    return $.compact(['repository', this.get('color'), this.get('selected') ? 'selected' : null]).join(' ');
  }.property('color', 'selected')
});

Travis.Repository.reopenClass({
  resource: 'repositories',
  latest: function() {
    return this.all({ orderBy: 'lastBuildFinishedAt DESC' });
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
