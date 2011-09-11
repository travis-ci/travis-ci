Travis.Build = Travis.Record.extend(Travis.Helpers.Urls, Travis.Helpers.Common, {
  repositoryId:   SC.Record.attr(Number, { key: 'repository_id' }),
  parentId:       SC.Record.attr(Number, { key: 'parent_id' }),
  config:         SC.Record.attr(Object),
  state:          SC.Record.attr(String),
  number:         SC.Record.attr(Number),
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
  log:            SC.Record.attr(String, { defaultValue: '' }),

  matrix: SC.Record.toMany('Travis.Build', { nested: true }), // TODO should be Travis.Test!

  parent: function() {
    //console.log('updating parent on build ' + this.get('id'));
    return this.get('parentId') ? Travis.Build.find(this.get('parentId')) : null;
  }.property('parentId', 'status').cacheable(),

  repository: function() {
    //console.log('updating repository on build ' + this.get('id'));
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repositoryId', 'status').cacheable(),

  build: function() {
    return this.get('matrix').objectAt(0);
  }.property('build', 'status').cacheable(),

  update: function(attrs) {
    if('status' in attrs) attrs.result = attrs.status
    if('matrix' in attrs) attrs.matrix = this._joinMatrixAttributes(attrs.matrix);
    this._super(attrs);
  },

  appendLog: function(log) {
    this.set('log', this.get('log') + log);
  },

  updateTimes: function() {
    this.notifyPropertyChange('startedAt');
    this.notifyPropertyChange('finishedAt');
  },

  isMatrix: function() {
    //console.log('updating isMatrix on build ' + this.get('id'));
    return this.getPath('matrix.length') > 1;
  }.property('matrix.status').cacheable(),

  color: function() {
    //console.log('updating color on build ' + this.get('id'));
    return this.colorForStatus(this.get('result'));
  }.property('status', 'result').cacheable(),

  duration: function() {
    //console.log('updating duration on build ' + this.get('id'));
    return this.durationFrom(this.get('startedAt'), this.get('finishedAt'));
  }.property('startedAt', 'finishedAt').cacheable(),

  configKeys: function() {
    return $.map($.keys($.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release')), function(key) { return $.camelize(key) });
  }.property('config').cacheable(),

  configValues: function() {
    return $.values($.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release'));
  }.property('config').cacheable(),

  // see https://github.com/sproutcore/sproutcore20/issues/160
  configKeyObjects: function() {
    //console.log('updating configKeyObjects on build ' + this.get('id'));
    return $.map(this.get('configKeys'), function(key) { return SC.Object.create({ key: key }) });
  }.property('config').cacheable(),

  configValueObjects: function() {
    //console.log('updating configValueObjects on build ' + this.get('id'));
    return $.map(this.get('configValues'), function(value) { return SC.Object.create({ value: value }) });
  }.property('config').cacheable(),

  // TODO the following display logic all seems to belong to a controller or helper module

  formattedCommit: function() {
    return (this.get('commit') || '').substr(0, 7) + (this.get('branch') ? ' (%@)'.fmt(this.get('branch')) : '');
  }.property('commit', 'branch').cacheable(),

  formattedDuration: function() {
    return this.readableTime(this.get('duration'));
  }.property('status', 'duration').cacheable(),

  formattedFinishedAt: function() {
    return this.timeAgoInWords(this.get('finishedAt')) || '-';
  }.property('status', 'finishedAt').cacheable(),

  formattedConfig: function() {
    if(this.get('isMatrix')) return;
    var config = $.only(this.get('config'), 'rvm', 'gemfile', 'env');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('config').cacheable(),

  formattedLog: function() {
    var log = this.get('parentId') ? this.get('log') : this.getPath('matrix.firstObject.log');
    return log ? Travis.Log.filter(log) : '';
  }.property('parentId', 'log', 'matrix.firstObject.log').cacheable(),

  formattedCompareUrl: function() {
    var parts = (this.get('compare_url') || '').split('/');
    return parts[parts.length - 1];
  }.property('compareUrl').cacheable(),

  // need to join given attributes with existing attributes because SC.Record.toMany
  // does not seem to allow partial updates, i.e. would remove existing attributes?
  _joinMatrixAttributes: function(attrs) {
    var _this = this;
    return $.each(attrs, function(ix, build) {
      if(build.status) build.result = build.status;
      attrs[ix] = $.extend(_this.get('matrix').objectAt(ix).get('attributes') || {}, build);
    });
  }
});

Travis.Build.reopenClass({
  resource: 'builds',

  byRepositoryId: function(id, parameters) {
    return this.all({ url: '/repositories/%@/builds.json?parent_id='.fmt(id), repositoryId: id, parentId: null, orderBy: 'number DESC' })
  },
});
