Travis.Controllers.Jobs = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      workers: this,
      queue: $.capitalize(this.get('queue')),
      template: SC.TEMPLATES['app/templates/jobs/list'],
      className: 'queue-' + this.get('queue')
    })
    this.view.appendTo('#jobs');
    this.set('content', Travis.Job.all({ queue: this.get('queue') }));
  }
});
