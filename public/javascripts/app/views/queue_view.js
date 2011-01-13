var QueueView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'job_added', 'job_started');

    this.jobs = args.jobs;
    this.template = args.templates['queue/show'];
    this.element = $('#right');
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.jobs.bind('add', this.job_added);
    this.jobs.bind('remove', this.job_removed);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.build) {
      this.jobs.bind('add', this.job_added);
    }
  },
  render: function() {
    this.jobs.load(function() {
      this.bind();
      this.element.html($(this.template({ jobs: this.jobs.toJSON().reverse() })));
      // Util.update_times(element);
    }.bind(this));
  },
  job_added: function(job) {
    $('#queue', this.element).prepend($('<li id="job_' + job.get('meta_id') + '">' + job.get('repository').name + ' #' + job.get('number') + '</li>'));
  },
  job_removed: function(job) {
    $('#queue #job_' + job.get('meta_id')).remove();
  }
});


