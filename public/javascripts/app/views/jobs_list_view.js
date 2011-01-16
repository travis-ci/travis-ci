var JobsListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'render_items', 'render_item', 'job_added', 'job_removed', 'update_empty');

    this.jobs = args.jobs;
    this.list_template = args.templates['jobs/list'];
    this.item_template = args.templates['jobs/_item'];
    // this.element = $('#right');
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.jobs.bind('add', this.job_added);
    this.jobs.bind('remove', this.job_removed);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.jobs) {
      this.jobs.unbind('add', this.job_added);
      this.jobs.unbind('remove', this.job_removed);
    }
  },
  render: function() {
    this.bind();
    $('#right #jobs').remove();
    $('#right').append($(this.list_template({})));
    this.element = $('#right #jobs');
    $('.loading', this.element).show();
    this.render_items(this.jobs);
  },
  render_items: function(jobs) {
    $('.loading', this.element).hide();
    this.update_empty();
    _.each(jobs.models, function(job) { this.render_item(job) }.bind(this));
    // Util.update_times(this.element);
  },
  render_item: function(job) {
    $('ul', this.element).prepend($(this.item_template(job.toJSON())));
  },
  job_added: function(job) {
    console.log(job)
    this.update_empty();
    this.render_item(job);
  },
  job_removed: function(job) {
    this.update_empty();
    $('#job_' + job.get('meta_id'), this.element).remove();
  },
  update_empty: function() {
    var element = $('.empty', this.element);
    this.jobs.length == 0 ? element.show() : element.hide();
  }
});
