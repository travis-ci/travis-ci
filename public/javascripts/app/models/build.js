var Build = Backbone.Model.extend({
});

var Builds = Backbone.Collection.extend({
  url: '/builds',
  model: Build
});
