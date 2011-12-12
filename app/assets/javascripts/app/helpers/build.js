Travis.Helpers.Build = {
  color: function() {
    return this.getPath('content.color');
  }.property('content.result').cacheable(),

  commit: function() {
    var branch = this.getPath('content.branch');
    return (this.getPath('content.commit') || '').substr(0, 7) + (branch ? ' (%@)'.fmt(branch) : '');
  }.property('content.commit', 'content.branch').cacheable(),

  compareUrl: function() {
    var parts = (this.getPath('content.compareUrl') || '').split('/');
    return parts[parts.length - 1];
  }.property('content.compare_url').cacheable(),

  duration: function() {
    return Travis.Helpers.Common.readableTime(this.getPath('content.duration'));
  }.property('content.duration').cacheable(),

  finishedAt: function() {
    return Travis.Helpers.Common.timeAgoInWords(this.getPath('content.finishedAt')) || '-';
  }.property('content.finished_at').cacheable(),

  log: function() {
    var log = this.getPath('content.log');
    return log ? Travis.Log.filter(log) : '';
  }.property('content.log').cacheable(),

  config: function() {
    var config = $.only(this.getPath('content.config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  }.property('content.config').cacheable(),
};
