Travis.Controllers.Workers = Ember.ArrayController.extend({
  init: function() {
    this._super();
    this.view = Ember.View.create({
      content: this,
      templateName: 'app/templates/workers/list'
    });
    this.view.appendTo('#workers');

    this.set('workers', Travis.Worker.all({ orderBy: 'host' }));
    this.set('content', []);
  },

  workersObserver: function() {
    this.groups = {};
    var workers = this.get('workers') || [];

    workers.forEach(function(worker) {
      var host = worker.get('host');
      if(!(host in this.groups)) this.groups[host] = Travis.WorkerGroup.create();
      this.groups[host].add(worker);
    }.bind(this));

    this.set('content', $.values(this.groups));
  }.observes('workers.length')
});
