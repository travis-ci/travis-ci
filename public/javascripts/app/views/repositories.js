Travis.Views.Repositories = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'bind', 'unbind', 'repositoriesUpdated', 'repositoryAdded', 'buildUpdated', 'buildStarted', 'buildStopped', 'renderRepository', 'updateStatus');

    this.app = args.app;
    this.repositories = args.app.repositories;
    this.template = args.app.templates['repositories/_item'];
    this.element = $('#left #repositories');

    this.repositories.bind('refresh', this.repositoriesUpdated);
    this.repositories.bind('add', this.repositoryAdded);
    this.repositories.bind('build:add', this.buildUpdated);
    this.repositories.bind('build:change', this.buildUpdated);

    setTimeout(this.updateStatus, 500)
  },
  repositoriesUpdated: function() {
    this.element.empty();
    _.each(this.repositories.models, this.renderRepository);
    this.element.updateTimes();
    this.updateStatus();
  },
  repositoryAdded: function(item) {
    var repository = _.isFunction(item.repository) ? item.repository() : item;
    var element = this.renderRepository(repository);
    element.updateTimes();
  },
  buildUpdated: function(item) {
    var repository = _.isFunction(item.repository) ? item.repository() : item;
    $('#repository_' + repository.id, this.element).remove();
    var element = this.renderRepository(repository);
    element.updateTimes();
  },
  renderRepository: function(repository) {
    return this.element.prepend($(this.template(repository.toJSON())));
  },
  setCurrent: function(repository) {
    $('.repository', this.element).removeClass('current');
    $('#repository_' + repository.id, this.element).addClass('current');
  },
  updateStatus: function() {
    this.element.removeClass('active');
    _.each(this.repositories.models, function(repository) {
      if(repository.isBuilding()) $('#repository_' + repository.id, this.element).addClass('active');
    });
  }
});
