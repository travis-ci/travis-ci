Travis.Build = Travis.Record.extend(Travis.Helpers.Common, {
  repositoryId:         SC.Record.attr(Number, { key: 'repository_id' }),
  parentId:             SC.Record.attr(Number, { key: 'parent_id' }),
  config:               SC.Record.attr(Object),
  state:                SC.Record.attr(String),
  number:               SC.Record.attr(Number),
  commit:               SC.Record.attr(String),
  branch:               SC.Record.attr(String),
  message:              SC.Record.attr(String),
  result:               SC.Record.attr(Number),
  startedAt:            SC.Record.attr(String, { key: 'started_at' }), // use DateTime?
  finishedAt:           SC.Record.attr(String, { key: 'finished_at' }),
  committedAt:          SC.Record.attr(String, { key: 'committed_at' }),
  committerName:        SC.Record.attr(String, { key: 'committer_name' }),
  committerEmail:       SC.Record.attr(String, { key: 'committer_email' }),
  committerMailToEmail: SC.Record.attr(String, { key: 'mail_to_hex_committer_email' }),
  authorName:           SC.Record.attr(String, { key: 'author_name' }),
  authorEmail:          SC.Record.attr(String, { key: 'author_email' }),
  authorMailToEmail:    SC.Record.attr(String, { key: 'mail_to_hex_author_email' }),
  compareUrl:           SC.Record.attr(String, { key: 'compare_url' }),
  log:                  SC.Record.attr(String, { defaultValue: '' }),

  matrix: SC.Record.toMany('Travis.Build', { nested: true }), // TODO should be Travis.Test!

  parent: function() {
    if(window.__DEBUG__) console.log('updating parent on build ' + this.get('id'));
    return this.get('parentId') ? Travis.Build.find(this.get('parentId')) : null;
  }.property('parent_id').cacheable(),

  repository: function() {
    if(window.__DEBUG__) console.log('updating repository on build ' + this.get('id'));
    return Travis.Repository.find(this.get('repositoryId'));
  }.property('repository_id').cacheable(),

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
  }.property('matrix.length').cacheable(),

  color: function() {
    if(window.__DEBUG__) console.log('updating color on build ' + this.get('id'));
    return this.colorForStatus(this.get('result'));
  }.property('result').cacheable(),

  duration: function() {
    if(window.__DEBUG__) console.log('updating duration on build ' + this.get('id'));
    return this.durationFrom(this.get('startedAt'), this.get('finishedAt'));
  }.property('startedAt', 'finishedAt').cacheable(),

  subscribe: function() {
    var id = this.get('id');
    if(id && !this._subscribed) {
      this._subscribed = true;
      $.ajax({ url: '/builds/%@.json'.fmt(id), dataType: 'json', success: function(data, status, response) {
          Travis.subscribe('build-' + id);
          this.set('log', data.log);
        }.bind(this)
      });
    }
  },

  unsubscribe: function() {
    this._subscribed = false;
    Travis.subscribe('build-' + this.get('id'));
  },

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
    return this.all({ url: '/repositories/%@/builds.json?parent_id=&bare=true'.fmt(id), repositoryId: id, parentId: null, orderBy: 'number DESC' });
  }
});
