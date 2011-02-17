Travis.Views.Jobs = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'renderItems', 'renderItem', 'jobAdded', 'jobRemoved', 'updateEmpty');

    this.jobs = args.app.jobs;
    this.templates = {
      list: args.app.templates['jobs/list'],
      item: args.app.templates['jobs/_item']
    }
    // this.element = $('#right');
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.jobs.bind('add', this.jobAdded);
    this.jobs.bind('remove', this.jobRemoved);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.jobs) {
      this.jobs.unbind('add', this.jobAdded);
      this.jobs.unbind('remove', this.jobRemoved);
    }
  },
  render: function() {
    this.bind();
    $('#right #jobs').remove();
    $('#right').append($(this.templates.list({})));
    this.element = $('#right #jobs');
    $('.loading', this.element).show();
    this.renderItems(this.jobs);
  },
  renderItems: function(jobs) {
    $('.loading', this.element).hide();
    this.updateEmpty();
    _.each(jobs.models, function(job) { this.renderItem(job) }.bind(this));
    // Travis.Helpers.Util.updateTimes(this.element);
  },
  renderItem: function(job) {
    $('ul', this.element).prepend($(this.templates.item(job.toJSON())));
  },
  jobAdded: function(job) {
    this.updateEmpty();
    this.renderItem(job);
  },
  jobRemoved: function(job) {
    this.updateEmpty();
    $('#job_' + job.get('meta_id'), this.element).remove();
  },
  updateEmpty: function() {
    var element = $('.empty', this.element);
    this.jobs.length == 0 ? element.show() : element.hide();
  }
});
