var WorkersListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'render_items', 'render_item', 'worker_added', 'worker_removed', 'update_empty');

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
    $('#right #workers').remove();
    $('#right').append($(this.list_template({ workers: [] })));
    this.element = $('#right #workers');
    $('.loading', this.element).show();
    this.render_items(this.workers);
    /* this.workers.load(this.render_items); */
  },
  render_items: function(workers) {
    $('.loading', this.element).hide();
    this.update_empty();
    _.each(workers.models, function(worker) { this.render_item(worker) }.bind(this));
    // Util.update_times(this.element);
  },
  render_item: function(worker) {
    $('ul', this.element).prepend(this.item_template(worker.toJSON()));
  },
  worker_added: function(worker) {
    this.render_item(worker);
  },
  worker_removed: function(worker) {
    $('#worker_' + worker.get('meta_id'), this.element).remove();
  },
  update_empty: function() {
    var element = $('.empty', this.element);
    this.workers.length == 0 ? element.show() : element.hide();
  }
});

