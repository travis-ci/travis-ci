Travis.ServiceHook = Travis.Record.extend({
  primaryKey: 'uid',

  toggle: function() {
    this.writeAttribute('active', !this.get('active'));
    this.commitRecord({ owner_name: this.get('owner_name'), name: this.get('name') });
  }
});

Travis.ServiceHook.reopenClass({
  resource: 'profile/service_hooks'
});

