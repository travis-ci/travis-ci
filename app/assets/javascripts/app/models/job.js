Travis.Job = Travis.Record.extend(Travis.Helpers.Common, {
  repositoryId:   SC.Record.attr(Number, { key: 'repository_id' }),
  buildId:        SC.Record.attr(Number, { key: 'build_id' }),
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
  log:            SC.Record.attr(String),

  build: function() {
    if(window.__DEBUG__) console.log('updating build on job ' + this.get('id'));
    return Travis.Build.find(this.get('buildId'));
  }.property('build_id').cacheable(),

  update: function(attrs) {
    this.get('build').whenReady(function(build) {
      var job = build.get('matrix').find(function(a) { return a.get('id') == this.get('id') });
      if(job) { job.update(attrs); }
    });
    this._super(attrs);
  },

  repository: function() {
    if(window.__DEBUG__) console.log('updating repository on job ' + this.get('id'));
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repository_id').cacheable(),

  appendLog: function(log) {
    this.set('log', this.get('log') + log);
  },

  updateTimes: function() {
    this.notifyPropertyChange('startedAt');
    this.notifyPropertyChange('finishedAt');
  },

  color: function() {
    if(window.__DEBUG__) console.log('updating color on job ' + this.get('id'));
    return this.colorForStatus(this.get('result'));
  }.property('result').cacheable(),

  duration: function() {
    if(window.__DEBUG__) console.log('updating duration on job ' + this.get('id'));
    return this.durationFrom(this.get('startedAt'), this.get('finishedAt'));
  }.property('started_at', 'finished_at').cacheable(),

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
});

Travis.Job.reopenClass({
  resource: 'jobs'
});

