Travis.Build = Travis.Record.extend(Travis.Helpers.Common, {
  repository_id:   SC.Record.attr(Number),
  config:          SC.Record.attr(Object),
  state:           SC.Record.attr(String),
  number:          SC.Record.attr(Number),
  commit:          SC.Record.attr(String),
  branch:          SC.Record.attr(String),
  message:         SC.Record.attr(String),
  result:          SC.Record.attr(Number),
  duration:        SC.Record.attr(Number),
  started_at:      SC.Record.attr(String), // use DateTime?
  finished_at:     SC.Record.attr(String),
  committed_at:    SC.Record.attr(String),
  committer_name:  SC.Record.attr(String),
  committer_email: SC.Record.attr(String),
  author_name:     SC.Record.attr(String),
  author_email:    SC.Record.attr(String),
  compare_url:     SC.Record.attr(String),
  log:             SC.Record.attr(String),

  matrix: SC.Record.toMany('Travis.Job', { nested: true }),

  repository: function() {
    if(this.get('repository_id')) return Travis.Repository.find(this.get('repository_id'));
  }.property('repository_id').cacheable(),

  update: function(attrs) {
    if('matrix' in attrs) attrs.matrix = this._joinMatrixAttributes(attrs.matrix);
    this._super(attrs);
  },

  updateTimes: function() {
    this.notifyPropertyChange('duration');
    this.notifyPropertyChange('finished_at');
  },

  isMatrix: function() {
    return this.getPath('matrix.length') > 1;
  }.property('matrix.length').cacheable(),

  color: function() {
    return this.colorForResult(this.get('result'));
  }.property('result').cacheable(),

  // We need to join given attributes with existing attributes because SC.Record.toMany
  // does not seem to allow partial updates, i.e. would remove existing attributes?
  _joinMatrixAttributes: function(attrs) {
    var _this = this;
    return $.each(attrs, function(ix, job) {
      var _job = _this.get('matrix').objectAt(ix);
      if(_job) attrs[ix] = $.extend(_job.get('attributes') || {}, job);
    });
  },

  // VIEW HELPERS

  formattedDuration: function() {
    var duration = this.get('duration');
    if(!duration) duration = this.durationFrom(this.get('started_at'), this.get('finished_at'));
    return this.readableTime(duration);
  }.property('duration', 'started_at', 'finished_at'),

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

  formattedMatrixHeaders: function() {
    var keys = $.keys($.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js'));
    return $.map(['Job', 'Duration', 'Finished'].concat(keys), function(key) { return $.camelize(key) });
  }.property('config').cacheable(),

  formattedMessage: function(){
    return this.emojize(this.get('message') || '');
  }.property('message'),

  url: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds/' + this.get('id');
  }.property('repository.status', 'id'),

  urlAuthor: function() {
    return 'mailto:' + this.get('author_email');
  }.property('author_email').cacheable(),

  urlCommitter: function() {
    return 'mailto:' + this.get('committer_email');
  }.property('committer_email').cacheable(),

  urlGithubCommit: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/commit/' + this.get('commit');
  }.property('repository.slug', 'commit').cacheable()
});

Travis.Build.reopenClass({
  resource: 'builds',

  byRepositoryId: function(id, parameters) {
    return this.all({ url: '/repositories/%@/builds.json?bare=true'.fmt(id), repository_id: id, orderBy: 'number DESC' });
  }
});
