Travis.Controllers.Events = SC.Object.extend({
  receive: function(event, data) {
    var events = this;
    var action = $.camelize(event.replace(':', '_'), false);
    SC.run(function() { events[action](data); });
  },

  buildQueued: function(data) {
    var queue = data.repository.slug == 'rails/rails' ? 'rails' : 'builds';
    var data = $.extend(data.build, { repository: data.repository, queue: queue });
    Travis.store.createRecord(Travis.Job, data);
  },

  buildRemoved: function(data) {
    var job = Travis.Job.find(data.build.id);
    if(job) job.destroy();
  },

  buildFinished: function(data) {
    this.buildRemoved(data);
    var build = Travis.Build.find(data.build.id);

    if(build.get('status') == SC.Record.READY_CLEAN) {
      $.each(data.build, function(name, value) {
        if(name == 'status') name = 'result';
        if(name != 'id') build.set(name, value);
      });
    }
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
