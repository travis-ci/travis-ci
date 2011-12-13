Travis.Controllers.Queue = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      jobs: this,
      queue: $.camelize(this.get('queue').split('.')[1]),
      templateName: 'app/templates/queue/show',
      classNames: ['queue-' + this.get('queue').replace('.', '_')]
    });
    this.view.appendTo('#jobs');
    this.set('content', Travis.Job.all({ state: 'created', queue: this.get('queue') }));
  }
});
