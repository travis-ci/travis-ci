Travis.Job = Travis.Record.extend(Travis.Helpers.Common, {
  repository_id:   SC.Record.attr(Number),
  build_id:        SC.Record.attr(Number),
  config:          SC.Record.attr(Object),
  state:           SC.Record.attr(String),
  number:          SC.Record.attr(Number),
  commit:          SC.Record.attr(String),
  branch:          SC.Record.attr(String),
  message:         SC.Record.attr(String),
  result:          SC.Record.attr(Number),
  started_at:      SC.Record.attr(String), // use DateTime?
  finished_at:     SC.Record.attr(String),
  committed_at:    SC.Record.attr(String),
  committer_name:  SC.Record.attr(String),
  committer_email: SC.Record.attr(String),
  author_name:     SC.Record.attr(String),
  author_email:    SC.Record.attr(String),
  compare_url:     SC.Record.attr(String),
  log:             SC.Record.attr(String),

  build: function() {
    if(window.__DEBUG__) console.log('updating build on job ' + this.get('id'));
    return Travis.Build.find(this.get('build_id'));
  }.property('build_id').cacheable(),

  update: function(attrs) {
    var build = this.get('build');
    if(build) build.whenReady(function(build) {
      var job = build.get('matrix').find(function(a) { return a.get('id') == this.get('id') });
      if(job) { job.update(attrs); }
    });
    this._super(attrs);
  },

  repository: function() {
    return Travis.Repository.find(this.get('repository_id'));
  }.property('repository_id').cacheable(),

  appendLog: function(log) {
    this.set('log', this.get('log') + log);
  },

  updateTimes: function() {
    this.notifyPropertyChange('duration');
    this.notifyPropertyChange('finished_at');
  },

  color: function() {
    return this.colorForResult(this.get('result'));
  }.property('result').cacheable(),

  duration: function() {
    return this.durationFrom(this.get('started_at'), this.get('finished_at'));
  }.property('finished_at'),

  subscribe: function() {
    var id = this.get('id');
    if(id && !this._subscribed) {
      this._subscribed = true;
      Travis.subscribe('job-' + id);
    }
  },

  unsubscribe: function() {
    this._subscribed = false;
    Travis.subscribe('job-' + this.get('id'));
  },

  // VIEW HELPERS

  formattedDuration: function() {
    return this.readableTime(this.get('duration'));
  }.property('duration'),

  formattedFinishedAt: function() {
    return this.timeAgoInWords(this.get('finished_at')) || '-';
  }.property('finished_at').cacheable(),

  formattedCommit: function() {
    var branch = this.get('branch');
    return (this.get('commit') || '').substr(0, 7) + (branch ? ' (%@)'.fmt(branch) : '');
  }.property('commit', 'branch').cacheable(),

  formattedCompareUrl: function() {
    var parts = (this.get('compare_url') || '').split('/');
    return parts[parts.length - 1];
  }.property('compare_url').cacheable(),

  formattedConfig: function() {
    var config = $.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('config').cacheable(),

  formattedConfigValues: function() {
    var values = $.values($.only(this.getPath('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js'));
    return $.map(values, function(value) { return SC.Object.create({ value: value }) });
  }.property().cacheable(),

  formattedLog: function() {
    var log = this.getPath('log');
    return log ? Travis.Log.filter(log) : '';
  }.property('log').cacheable(),

  url: function() {
    return '#!/' + this.getPath('repository.slug') + '/jobs/' + this.get('id');
  }.property('repository', 'id'),
});

Travis.Job.reopenClass({
  resource: 'jobs'
});

