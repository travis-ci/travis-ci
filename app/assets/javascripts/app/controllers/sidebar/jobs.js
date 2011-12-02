Travis.Controllers.Jobs = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      jobs: this,
      queue: $.camelize(this.get('queue').split('.')[1]),
      templateName: 'app/templates/jobs/list',
      classNames: ['queue-' + this.get('queue').replace('.', '_')]
    });
    this.view.appendTo('#jobs');
    this.set('content', Travis.Job.all({ queue: this.get('queue') }));
  }
});
