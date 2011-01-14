var WorkersListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'render_items', 'render_item', 'worker_added', 'worker_started');

    this.workers = args.workers;
    this.list_template = args.templates['workers/list'];
    this.item_template = args.templates['workers/_item'];
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.workers.bind('add', this.worker_added);
    this.workers.bind('remove', this.worker_removed);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.build) {
      this.workers.bind('add', this.worker_added);
    }
  },
  render: function() {
    this.bind();
    $('#right').append($(this.list_template({ workers: [] })));
    this.element = $('#right #workers');
    $('.loading', this.element).show();
    this.workers.load(this.render_items);
  },
  render_items: function(workers) {
    $('.loading', this.element).hide();
    if(workers.length == 0) {
      $('.empty', this.element).show();
    } else {
      $('.empty', this.element).hide();
      _.each(workers.models, function(worker) { this.render_item(worker) }.bind(this));
    }
    // Util.update_times(this.element);
  },
  render_item: function(worker) {
    $(this.element).prepend(this.item_template(worker.toJSON()));
  },
  worker_added: function(worker) {
    this.render_item(worker);
  },
  worker_removed: function(worker) {
    $('#worker_' + worker.get('meta_id'), this.element).remove();
  }
});

