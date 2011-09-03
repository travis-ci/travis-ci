Travis.Test = Travis.Record.extend(Travis.Helpers.Urls, Travis.Helpers.Common, Travis.Build, {
  parentId: SC.Record.attr(Number, { key: 'parent_id' }),
  log:      SC.Record.attr(String),

  build: function() {
    return this.get('parentId') ? Travis.Build.find(this.get('parentId')) : null;
  }.property(),

  formattedLog: function() {
    return this.get('log'); // fold log etc. here
  }.property('log'),
});
