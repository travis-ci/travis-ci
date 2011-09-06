Travis.Controllers.Repositories = SC.ArrayController.extend({
  init: function() {
    var view = SC.View.create({
      repositories: this,
      template: SC.TEMPLATES['app/templates/repositories/list']
    });
    view.appendTo('#tab_recent .tab');
    this.set('content', Travis.Repository.recent());
  }
});
