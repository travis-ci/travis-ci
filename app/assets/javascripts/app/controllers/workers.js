Travis.Controllers.Workers = SC.ArrayController.extend({
  init: function() {
    var view = SC.View.create({
      workers: this,
      template: SC.TEMPLATES['app/templates/workers/list']
    })
    view.appendTo('#workers');
    this.set('content', Travis.Worker.all());
  }
});
