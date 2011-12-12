Travis.Build = Travis.Record.extend(Travis.Helpers.Common, {
  repositoryId:   SC.Record.attr(Number, { key: 'repository_id' }),
  config:         SC.Record.attr(Object),
  state:          SC.Record.attr(String),
  number:         SC.Record.attr(Number),
  commit:         SC.Record.attr(String),
  branch:         SC.Record.attr(String),
  message:        SC.Record.attr(String),
  result:         SC.Record.attr(Number),
  duration:       SC.Record.attr(Number),
  startedAt:      SC.Record.attr(String, { key: 'started_at' }), // use DateTime?
  finishedAt:     SC.Record.attr(String, { key: 'finished_at' }),
  committedAt:    SC.Record.attr(String, { key: 'committed_at' }),
  committerName:  SC.Record.attr(String, { key: 'committer_name' }),
  committerEmail: SC.Record.attr(String, { key: 'committer_email' }),
  authorName:     SC.Record.attr(String, { key: 'author_name' }),
  authorEmail:    SC.Record.attr(String, { key: 'author_email' }),
  compareUrl:     SC.Record.attr(String, { key: 'compare_url' }),
  log:            SC.Record.attr(String),

  matrix: SC.Record.toMany('Travis.Job', { nested: true }),

  repository: function() {
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repository_id').cacheable(),

  update: function(attrs) {
    if('matrix' in attrs) attrs.matrix = this._joinMatrixAttributes(attrs.matrix);
    this._super(attrs);
  },

  updateTimes: function() {
    this.notifyPropertyChange('startedAt');
    this.notifyPropertyChange('finishedAt');
  },

  isMatrix: function() {
    return this.getPath('matrix.length') > 1;
  }.property('matrix.length').cacheable(),

  color: function() {
    return this.colorForStatus(this.get('result'));
  }.property('result').cacheable(),

  // need to join given attributes with existing attributes because SC.Record.toMany
  // does not seem to allow partial updates, i.e. would remove existing attributes?
  _joinMatrixAttributes: function(attrs) {
    var _this = this;
    return $.each(attrs, function(ix, job) {
      var _job = _this.get('matrix').objectAt(ix);
      if(_job) attrs[ix] = $.extend(_job.get('attributes') || {}, job);
    });
  },

  // VIEW HELPERS

  formattedMatrixHeaders: function() {
    var keys = $.keys($.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js'));
    return $.map(['Build', 'Duration', 'Finished'].concat(keys), function(key) { return $.camelize(key) });
  }.property('config').cacheable(),

  url: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds/' + this.get('id');
  }.property('repository.slug', 'id').cacheable(),

  urlAuthor: function() {
    this.get('authorEmail')
    return 'mailto:' + this.get('authorEmail');
  }.property('author_email').cacheable(),

  urlCommitter: function() {
    return 'mailto:' + this.get('committerEmail');
  }.property('committer_email').cacheable(),

  urlGithubCommit: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/commit/' + this.get('commit');
  }.property('repository.slug', 'commit').cacheable(),

});

Travis.Build.reopenClass({
  resource: 'builds',

  byRepositoryId: function(id, parameters) {
    return this.all({ url: '/repositories/%@/builds.json?bare=true'.fmt(id), repositoryId: id, orderBy: 'number DESC' });
  }
});
