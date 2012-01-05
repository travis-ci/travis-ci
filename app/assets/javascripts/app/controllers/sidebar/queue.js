Travis.Controllers.Queue = Ember.ArrayController.extend({
  init: function() {
    this._super();
    this.view = Ember.View.create({
      jobs: this,
      queue: $.camelize(this.get('queue').split('.')[1]),
      templateName: 'app/templates/queue/show',
      classNames: ['queue-' + this.get('queue').replace('.', '_')]
    });
    this.view.appendTo('#jobs');
    this.set('content', Travis.Job.all({ state: 'created', queue: this.get('queue') }));
  }
});
