Travis.Controllers.Events = SC.Object.extend({
  receive: function(event, data) {
    var events = this;
    var action = $.camelize(event.replace(':', '_'), false);
    events[action](data);
  },

  jobCreated: function(data) {
    Travis.Job.createOrUpdate($.extend(data, { state: 'created' }));
  },

  jobStarted: function(data) {
    var job = Travis.Job.find(data.id);
    if(job) {
      job.update($.extend(data, { state: 'started' }));
    };
  },

  jobLog: function(data) {
    var job = Travis.Job.find(data.id);
    if(job) job.whenReady(function(job) {
      job.appendLog(data._log);
    });
  },

  jobFinished: function(data) {
    var job = Travis.Job.find(data.id);
    if(job) {
      job.update($.extend(data, { state: 'finished' }));
      job.unsubscribe(); // TODO make Job listen to it's state and unsubscribe on finished
    };
  },

  buildStarted: function(data) {
    this.updateFrom(data);
  },

  buildFinished: function(data) {
    this.updateFrom(data);
  },

  workerAdded: function(data) {
    Travis.Worker.createOrUpdate(data);
  },

  workerCreated: function(data) {
    Travis.Worker.createOrUpdate(data);
  },

  workerUpdated: function(data) {
    Travis.Worker.createOrUpdate(data);
  },

  workerRemoved: function(data) {
    var worker = Travis.Worker.find(data.id);
    if(worker) worker.whenReady(function(worker) { worker.destroy() });
  },

  updateFrom: function(data) {
    if(data.repository) Travis.Repository.createOrUpdate(data.repository);
    if(data.build) Travis.Build.createOrUpdate(data.build);
  }
});
