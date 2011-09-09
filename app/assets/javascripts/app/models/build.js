Travis.Build = Travis.Record.extend(Travis.Helpers.Urls, Travis.Helpers.Common, {
  repositoryId:   SC.Record.attr(Number, { key: 'repository_id' }),
  parentId:       SC.Record.attr(Number, { key: 'parent_id' }),
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
  log:            SC.Record.attr(String),

  matrix: SC.Record.toMany('Travis.Build', { nested: true }), // TODO should be Travis.Test!

  parent: function() {
    return this.get('parentId') ? Travis.Build.find(this.get('parentId')) : null;
  }.property('parentId', 'status'),

  repository: function() {
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repositoryId'),

  isMatrix: function() {
    return this.getPath('matrix.length') > 1;
  }.property('matrix.status'),

  appendLog: function(log) {
    this.set('log', this.get('log') + log);
  },

  color: function() {
    return this.colorForStatus(this.get('result'));
  }.property('status', 'result'),

  duration: function() {
    return this.durationFrom(this.get('startedAt'), this.get('finishedAt'));
  }.property('startedAt', 'finishedAt'),

  configKeys: function() {
    return $.map($.keys($.only(this.get('config'), 'rvm', 'gemfile', 'env')), function(key) { return $.camelize(key) });
  }.property('config'),

  configValues: function() {
    return $.values($.only(this.get('config'), 'rvm', 'gemfile', 'env'));
  }.property('config'),

  // see https://github.com/sproutcore/sproutcore20/issues/160
  configKeyObjects: function() {
    return $.map(this.get('configKeys'), function(key) { return SC.Object.create({ key: key }) });
  }.property('config'),

  configValueObjects: function() {
    return $.map(this.get('configValues'), function(value) { return SC.Object.create({ value: value }) });
  }.property('config'),

  // TODO the following display logic all seems to belong to a controller or helper module

  formattedCommit: function() {
    return (this.get('commit') || '').substr(0, 7) + (this.get('branch') ? ' (%@)'.fmt(this.get('branch')) : '');
  }.property('commit', 'branch'),

  formattedDuration: function() {
    return this.readableTime(this.get('duration'));
  }.property('status', 'duration'),

  formattedFinishedAt: function() {
    return this.timeAgoInWords(this.get('finishedAt')) || '-';
  }.property('status', 'finishedAt'),

  formattedConfig: function() {
    if(this.get('isMatrix')) return;
    var config = $.only(this.get('config'), 'rvm', 'gemfile', 'env');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('config'),

  formattedLog: function() {
    var log = this.get('parentId') ? this.get('log') : this.getPath('matrix.firstObject.log');
    return log ? Travis.Log.filter(log) : '';
  }.property('matrix', 'log'),

  build: function() {
    return this.get('matrix').objectAt(0);
  }.property('build'),

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
});

Travis.Build.reopenClass({
  resource: 'builds',

  byRepositoryId: function(id, parameters) {
    return this.all({ url: '/repositories/%@/builds.json?parent_id='.fmt(id), parentId: null, orderBy: 'number DESC' })
  },
});
