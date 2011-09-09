Travis.Controllers.Workers = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      workers: this,
      template: SC.TEMPLATES['app/templates/workers/list']
    })
    this.view.appendTo('#workers');
    this.set('content', Travis.Worker.all());
  }
});
