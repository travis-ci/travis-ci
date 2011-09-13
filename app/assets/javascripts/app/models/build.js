Travis.Build = Travis.Record.extend(Travis.Helpers.Common, {
  repositoryId:   SC.Record.attr(Number, { key: 'repository_id' }),
  parentId:       SC.Record.attr(Number, { key: 'parent_id' }),
  config:         SC.Record.attr(Object),
  state:          SC.Record.attr(String),
  number:         SC.Record.attr(Number),
  commit:         SC.Record.attr(String),
  branch:         SC.Record.attr(String),
  message:        SC.Record.attr(String),
  result:         SC.Record.attr(Number),
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
    if(window.__DEBUG__) console.log('updating parent on build ' + this.get('id'));
    return this.get('parentId') ? Travis.Build.find(this.get('parentId')) : null;
  }.property('parentId').cacheable(),

  repository: function() {
    if(window.__DEBUG__) console.log('updating repository on build ' + this.get('id'));
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repositoryId').cacheable(),

  update: function(attrs) {
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
    if(window.__DEBUG__) console.log('updating isMatrix on build ' + this.get('id'));
    return this.getPath('matrix.length') > 1;
  }.property('matrix').cacheable(),

  color: function() {
    if(window.__DEBUG__) console.log('updating color on build ' + this.get('id'));
    return this.colorForStatus(this.get('result'));
  }.property('result').cacheable(),

  duration: function() {
    if(window.__DEBUG__) console.log('updating duration on build ' + this.get('id'));
    return this.durationFrom(this.get('startedAt'), this.get('finishedAt'));
  }.property('startedAt', 'finishedAt').cacheable(),

  configKeys: function() {
    return $.map($.keys($.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release')), function(key) { return $.camelize(key) });
  }.property().cacheable(),

  configValues: function() {
    return $.values($.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release'));
  }.property().cacheable(),

  // see https://github.com/sproutcore/sproutcore20/issues/160
  // if i make these depend on 'config' then they would be updated on the matrix view on changes to the
  // build log attribute :/
  configKeyObjects: function() {
    if(window.__DEBUG__) console.log('updating configKeyObjects on build ' + this.get('id'));
    return $.map(this.get('configKeys'), function(key) { return SC.Object.create({ key: key }) });
  }.property().cacheable(),

  configValueObjects: function() {
    if(window.__DEBUG__) console.log('updating configValueObjects on build ' + this.get('id'));
    return $.map(this.get('configValues'), function(value) { return SC.Object.create({ value: value }) });
  }.property().cacheable(),

  // TODO the following display logic all seems to belong to a controller or helper module

  formattedCommit: function() {
    return (this.get('commit') || '').substr(0, 7) + (this.get('branch') ? ' (%@)'.fmt(this.get('branch')) : '');
  }.property('commit', 'branch').cacheable(),

  formattedDuration: function() {
    return this.readableTime(this.get('duration'));
  }.property('duration').cacheable(),

  formattedFinishedAt: function() {
    return this.timeAgoInWords(this.get('finishedAt')) || '-';
  }.property('finishedAt').cacheable(),

  formattedConfig: function() {
    var config = $.only(this.get('config'), 'rvm', 'gemfile', 'env');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('config').cacheable(),

  formattedLog: function() {
    var log = this.get('log');
    return log ? Travis.Log.filter(log) : '';
  }.property('log').cacheable(),

  formattedCompareUrl: function() {
    var parts = (this.get('compare_url') || '').split('/');
    return parts[parts.length - 1];
  }.property('compareUrl').cacheable(),

  // need to join given attributes with existing attributes because SC.Record.toMany
  // does not seem to allow partial updates, i.e. would remove existing attributes?
  _joinMatrixAttributes: function(attrs) {
    var _this = this;
    return $.each(attrs, function(ix, build) {
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
