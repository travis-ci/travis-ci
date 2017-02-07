Travis.Helpers.Build = {
  // Unfortunately CollectionView doesn't provide a way to define something else other than "content"
  // as the binding for the current item, so we can't just use "build" everywhere :/
  _build: function() {
    return this.get('build') || this.get('content');
  }.property('build', 'content'),

  color: function() {
    return this.getPath('_build.color');
  }.property('_build.result').cacheable(),

  commit: function() {
    var branch = this.getPath('_build.branch');
    return (this.getPath('_build.commit') || '').substr(0, 7) + (branch ? ' (%@)'.fmt(branch) : '');
  }.property('_build.commit', '_build.branch').cacheable(),

  compareUrl: function() {
    var parts = (this.getPath('build.compareUrl') || '').split('/');
    return parts[parts.length - 1];
  }.property('build.compare_url').cacheable(),

  duration: function() {
    return Travis.Helpers.Common.readableTime(this.getPath('_build.duration'));
  }.property('_build.duration').cacheable(),

  finishedAt: function() {
    return Travis.Helpers.Common.timeAgoInWords(this.getPath('_build.finishedAt')) || '-';
  }.property('_build.finished_at').cacheable(),

  log: function() {
    // if(this.getPath('build.parentId')) {
      var log = this.getPath('build.log');
    // } else {
    //  var log = this.getPath('build.matrix.firstObject.log');
    // }
    return log ? Travis.Log.filter(log) : '';
  }.property('build.parent_id', 'build.log').cacheable(),

  config: function() {
    var config = $.only(this.getPath('build.config'), 'rvm', 'gemfile', 'env');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('build.config').cacheable(),

  configKeys: function() {
    return $.map($.keys($.only(this.getPath('build.config'), 'rvm', 'gemfile', 'env', 'otp_release')), function(key) { return $.camelize(key) });
  }.property('*build').cacheable(),

  configValues: function() {
    return $.values($.only(this.getPath('_build.config'), 'rvm', 'gemfile', 'env', 'otp_release'));
  }.property('*_build').cacheable(),

  // see https://github.com/sproutcore/sproutcore20/issues/160
  // if i make these depend on 'config' then they would be updated on the matrix view on changes to the
  // build log attribute :/
  configKeyObjects: function() {
    if(window.__DEBUG__) console.log('updating configKeyObjects on build ' + this.get('id'));
    return $.map(this.get('configKeys'), function(key) { return SC.Object.create({ key: key }) });
  }.property('configKeys').cacheable(),

  configValueObjects: function() {
    if(window.__DEBUG__) console.log('updating configValueObjects on build ' + this.get('id'));
    return $.map(this.get('configValues'), function(value) { return SC.Object.create({ value: value }) });
  }.property('configValues').cacheable(),
}
