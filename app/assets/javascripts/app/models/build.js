Travis.Build = Travis.Record.extend(Travis.Helpers.Urls, Travis.Helpers.Common, {
  repositoryId:   SC.Record.attr(Number, { key: 'repository_id' }),
  config:         SC.Record.attr(Object),
  state:          SC.Record.attr(String),
  number:         SC.Record.attr(String),
  commit:         SC.Record.attr(String),
  branch:         SC.Record.attr(String),
  message:        SC.Record.attr(String),
  result:         SC.Record.attr(Number, { key: 'status' }), // status is reserved by SC
  startedAt:      SC.Record.attr(String, { key: 'started_at' }), // use DateTime?
  finishedAt:     SC.Record.attr(String, { key: 'finished_at' }),
  committedAt:    SC.Record.attr(String, { key: 'committed_at' }),
  committerName:  SC.Record.attr(String, { key: 'committer_name' }),
  committerEmail: SC.Record.attr(String, { key: 'committer_email' }),
  authorName:     SC.Record.attr(String, { key: 'author_name' }),
  authorEmail:    SC.Record.attr(String, { key: 'author_email' }),
  compareUrl:     SC.Record.attr(String, { key: 'compare_url' }),

  matrix: SC.Record.toMany('Travis.Build', { nested: true }), // TODO should be Travis.Test!

  // TODO these should be in Travis.Test but I can't get the toMany relation working with that
  parentId: SC.Record.attr(Number, { key: 'parent_id' }),
  log:      SC.Record.attr(String),

  build: function() {
    return this.get('parentId') ? Travis.Build.find(this.get('parentId')) : null;
  }.property(),

  formattedLog: function() {
    return this.get('log'); // fold log etc. here
  }.property('log'),


  repository: function() {
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repositoryId'),

  isMatrix: function() {
    return this.get('matrix.length') > 1;
  }.property('matrix'),

  color: function() {
    return this.colorForStatus(this.get('result'));
  }.property('result'),

  duration: function() {
    return this.durationFrom(this.get('startedAt'), this.get('finishedAt'));
  }.property('startedAt', 'finishedAt'),

  configDimensions: function() {
    return $.map($.keys($.except(this.get('config') || {}, '.configured')), function(value) { return $.camelize(value) });
  }.property('config'),

  configValues: function() {
    return $.values($.except(this.get('config') || {}, '.configured'));
  }.property('config'),

  // updateRepository: function() {
  //   var repository = this.get('repository');
  //   if(repository.get('lastBuildStartedAt') < this.get('startedAt') || repository.get('lastBuildFinishedAt') < this.get('finishedAt')) {
  //     repository.update({
  //       lastBuildNumber:     this.get('number'),
  //       lastBuildStatus:     this.get('result'),
  //       lastBuildStartedAt:  this.get('startedAt'),
  //       lastBuildFinishedAt: this.get('finishedAt'),
  //     });
  //   }
  // },

  // updateObserver: function() {
  //   this.updateRepository();
  // }.observes('startedAt', 'finishedAt', 'result'),

  // // TODO the following display logic all seems to belong to a controller or helper module

  formattedCommit: function() {
    return (this.get('commit') || '').substr(0, 7) + (this.get('branch') ? ' (%@)'.fmt(this.get('branch')) : '');
  }.property('commit', 'branch'),

  formattedDuration: function() {
    return this.readableTime(this.get('duration'));
  }.property('duration'),

  formattedFinishedAt: function() {
    return this.timeAgoInWords(this.get('finishedAt')) || '-';
  }.property('finishedAt'),

  formattedConfig: function() {
    var config = $.except(this.get('config') || {}, '.configured');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('config'),
});

Travis.Build.reopenClass({
  resource: 'builds',
  byRepositoryId: function(id, parameters) {
    return this.all({ url: '/repositories/%@/builds.json?parent_id='.fmt(id), orderBy: 'number DESC' })
  },
});
