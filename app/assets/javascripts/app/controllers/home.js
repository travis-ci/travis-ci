Travis.Controllers.Home = SC.Object.extend({

  init: function() {
    this.view = Travis.Views.Home.create({controller: this});
  },

  activate: function(params) {
    this.set('params', params);
    this.view.appendTo('#main');
  },
});
