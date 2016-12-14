Travis.ServiceHook = Travis.Record.extend({
  primaryKey: 'uid',

  toggle: function() {
    this.writeAttribute('active', !this.get('active'));
    this.commitRecord({ owner_name: this.get('owner_name'), name: this.get('name') });
  },

  urlGithubAdmin: function() {
    return this.get('url') + '/admin/hooks#travis_minibucket';
  }.property('slug').cacheable(),
});

Travis.ServiceHook.reopenClass({
  resource: 'profile/service_hooks'
});

