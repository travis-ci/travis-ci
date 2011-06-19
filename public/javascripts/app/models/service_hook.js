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
  },
  sync: function(method, model, success, error) {
    var params = {
      url:          this.url(),
      type:         Backbone.methodMap[method],
      contentType:  'application/json',
      dataType:     'json',
      processData:  false,
      success:      _.bind(function(resp) {
        this.csrfToken = ajax.getResponseHeader('Csrf-Token')
        success(resp)
      }, this),
      error:        error
    };

    ajax = $.ajax(params);
  }
});
