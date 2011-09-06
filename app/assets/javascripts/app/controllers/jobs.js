Travis.Controllers.Jobs = SC.ArrayController.extend({
  init: function() {
    var view = SC.View.create({
      workers: this,
      queue: $.capitalize(this.get('queue')),
      template: SC.TEMPLATES['app/templates/jobs/list']
    })
    view.appendTo('#jobs.queue-' + this.get('queue'));
    this.set('content', Travis.Job.all({ queue: this.get('queue') }));
  }
});
