Travis.Controllers.Events = SC.Object.extend({
  receive: function(event, data) {
    var events = this;
    var action = $.camelize(event.replace(':', '_'), false);
    SC.run(function() { events[action](data); });
  },

  buildQueued: function(data) {
    var data = $.extend(data.build, { repository: data.repository });
    Travis.store.createRecord(Travis.Job, data);
  },

  buildRemoved: function(data) {
    var job = Travis.Job.find(data.build.id);
    if(job) job.destroy();
  },

  buildFinished: function(data) {
    this.buildRemoved(data);
  },

  buildStarted: function(data) {
    if(!Travis.store.storeKeyExists(Travis.Repository, data.repository.id)) {
      Travis.store.createRecord(Travis.Repository, data.repository);
    }
    Travis.store.createRecord(Travis.Build, data.build);
  },

  buildLog: function(data) {
    var test = Travis.Build.find(data.build.id);
    if(test) test.appendLog(data.build._log);
  }
});

