Travis.Controllers.Events = SC.Object.extend({
  receive: function(event, data) {
    var events = this;
    var action = $.camelize(event.replace(':', '_'), false);
    events[action](data);
  },

  buildQueued: function(data) {
    data = $.extend(data.build, { repository: data.repository });
    Travis.Job.createOrUpdate(data);
  },

  buildRemoved: function(data) {
    var job = Travis.Job.find(data.build.id);
    if(job) job.whenReady(function(job) { job.destroy() });
  },

  buildStarted: function(data) {
    this.updateFrom(data);
  },

  buildLog: function(data) {
    var test = Travis.Build.find(data.build.id);
    if(test) test.whenReady(function(test) { test.appendLog(data.build._log); });
  },

  buildFinished: function(data) {
    this.updateFrom(data);
    var build = Travis.Build.find(data.build.id);
    if(build) build.unsubscribe();
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
    this.deferLastBuildIdUpdate(data.repository, function() {
      if(data.repository) var repository = Travis.Repository.createOrUpdate(data.repository);
      if(data.build) Travis.Build.createOrUpdate(data.build);
      return repository;
    });
  },

  deferLastBuildIdUpdate: function(attrs, block) {
    if(attrs && attrs.last_build_id) {
      var last_build_id = attrs.last_build_id;
      delete attrs.last_build_id;
    }
    var repository = block();
    if(last_build_id) {
      repository.set('lastBuildId', last_build_id);
    }
  }
});
