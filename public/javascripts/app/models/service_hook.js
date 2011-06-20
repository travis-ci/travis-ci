Travis.Models.ServiceHook = Backbone.Model.extend({
  url: function() {
    return '/profile/service_hooks'
  }
});

Travis.Collections.ServiceHooks = Backbone.Collection.extend({
  model: Travis.Models.ServiceHook,
  initialize: function(models) {
    Travis.Collections.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url', 'sync');
  },
  url: function() {
    return '/profile/service_hooks' + Utils.queryString(this.options);
  }
});
