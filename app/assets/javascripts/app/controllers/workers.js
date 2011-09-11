Travis.Controllers.Workers = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      content: this,
      template: SC.TEMPLATES['app/templates/workers/list']
    })
    this.view.appendTo('#workers');

    this.set('workers', Travis.Worker.all());
    this.set('content', []);
  },

  workersObserver: function() {
    if(this.getPath('workers.length') && this.groups === undefined) { // why the heck can't i just return an array here
      this.groups = {};
      var workers = this.get('workers') || [];

      workers.forEach(function(worker) {
        var name = worker.get('name');
        if(!(name in this.groups)) this.groups[name] = Travis.WorkerGroup.create();
        this.groups[name].add(worker);
      }.bind(this));

      this.set('content', $.values(this.groups));
    }
  }.observes('workers.length')
});
