Travis.Views.Workers = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'renderItems', 'renderItem', 'workerAdded', 'workerRemoved', 'updateEmpty');

    this.workers = args.app.workers;
    this.listTemplate = args.app.templates['workers/list'];
    this.itemTemplate = args.app.templates['workers/_item'];
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.workers.bind('add', this.workerAdded);
    this.workers.bind('remove', this.workerRemoved);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.workers.unbind('add', this.workerAdded);
    this.workers.unbind('remove', this.workerRemoved);
  },
  render: function() {
    this.bind();
    $('#right #workers').remove();
    $('#right').append($(this.listTemplate({ workers: [] })));
    this.element = $('#right #workers');
    $('.loading', this.element).show();
    this.workers.load(this.renderItems);
  },
  renderItems: function(workers) {
    $('.loading', this.element).hide();
    this.updateEmpty();
    _.each(workers.models, function(worker) { this.renderItem(worker) }.bind(this));
  },
  renderItem: function(worker) {
    $('ul', this.element).prepend(this.itemTemplate(worker.toJSON()));
  },
  workerAdded: function(worker) {
    this.renderItem(worker);
  },
  workerRemoved: function(worker) {
    $('#worker_' + worker.get('meta_id'), this.element).remove();
  },
  updateEmpty: function() {
    var element = $('.empty', this.element);
    this.workers.length == 0 ? element.show() : element.hide();
  }
});

