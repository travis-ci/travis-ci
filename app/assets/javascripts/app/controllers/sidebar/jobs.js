Travis.Controllers.Jobs = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      jobs: this,
      queue: $.capitalize(this.get('queue').split('.')[1]),
      templateName: 'app/templates/jobs/list',
      classNames: ['queue-' + this.get('queue')]
    });
    this.view.appendTo('#jobs');
    this.set('content', Travis.Job.all({ queue: this.get('queue') }));
  }
});
