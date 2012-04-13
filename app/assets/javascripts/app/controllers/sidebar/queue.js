Travis.Controllers.Queue = Ember.ArrayController.extend({
  init: function() {
    this._super();
    this.view = Ember.View.create({
      jobs: this,
      friendly_queue_name: this.get('display'),
      templateName: 'app/templates/queue/show',
      classNames: ['queue-' + this.get('queue').replace('.', '_')]
    });
    this.view.appendTo('#jobs');
    this.set('content', Travis.Job.all({ state: 'created', queue: this.get('queue') }));
  }
});
