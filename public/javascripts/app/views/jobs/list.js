Travis.Views.Jobs.List = Travis.Views.Base.List.extend({
  initialize: function(args) {
    this.queue = args.queue || 'build';
    this.selectors = {
      element: '#jobs.queue-' + this.queue,
      list:    '#jobs.queue-' + this.queue + ' ul',
      item:    '#jobs.queue-' + this.queue + ' #job_'
    }
    Travis.Views.Base.List.prototype.initialize.apply(this, arguments);
  },
  name: 'jobs',
  render: function() {
    this.element().replaceWith(this.templates.list({ queue: this.queue, queue_display: _.capitalize(this.queue) }));
    // this.element().addClass('loading');
  },
  elementRemoved: function(item) {
    $(this.selectors.item + item.get('id')).remove();
  },
});
