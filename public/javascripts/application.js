$(document).ready(function() {
  var Repository = Backbone.Model.extend({
  });

  var Repositories = Backbone.Collection.extend({
    url: '/repositories',
    model: Repository,
    initialize: function(app) {
      _.bindAll(this, 'build_created', 'build_updated');
    },
    build_created: function(data) {
      var attributes = data.repository;
      attributes.last_build = _.clone(data);
      delete attributes.last_build.repository;
      var repository = this.get(attributes.id);
      if(repository) { repository.set(attributes); }
      // add build unless present
    },
    build_updated: function(data) {
    }
  });

  var Build = Backbone.Model.extend({
  });

  var Builds = Backbone.Collection.extend({
    url: '/builds',
    model: Build
  });

  var RepositoriesListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'repositories',
    el: $('#repositories'),
    initialize: function (collection) {
      _.bindAll(this, 'repository_selected', 'build_created', 'build_updated', 'build_finished', 'render');

      this.collection = collection;
      collection.bind('add', this.repository_added);
      collection.bind('change', this.repository_updated)

      app.bind('repository:selected', this.repository_selected);
      app.bind('build:created', this.build_created);
      app.bind('build:updated', this.build_updated);
      app.bind('build:finished', this.build_finished);
    },
    render: function() {
      this.el.empty();
      var view = this;
      this.collection.each(function(item) {
        view.el.prepend($(templates['repositories/_item'](item.attributes)));
      });
      return this;
    },
    repository_selected: function(repository_id) {
      $('.repository', this.el).removeClass('active');
      $('#repository_' + repository_id, this.el).addClass('active');
    },
    repository_updated: function(repository) {
      $('#repository_' + repository.get('id')).html($(templates['repositories/_item'](repository.attributes)).html());
    },
    build_created: function(data) {
      Util.flash($('#repository_' + data.repository.id));
    },
    build_updated: function(data) {
    },
    build_finished: function(data) {
      Util.unflash($('#repository_' + data.repository.id));
    }
  });

  var RepositoryView = Backbone.View.extend({
    el: $('#right'),
    initialize: function(repository) {
      app.bind('build:created', this.build_created);
      app.bind('build:updated', this.build_updated);
      this.repository = repository;
    },
    render: function() {
      this.el.html($(templates['repositories/show'](this.repository.attributes)));
    },
    build_created: function(data) {
      // $('#repository_' + repository.get('id')).html($(templates['repositories/_item'](repository.attributes)).html());
      $('.log', this.el).empty();
    },
    build_updated: function(data) {
      if(data.log) {
        $('.log', this.el).append(Util.deansi(data.log));
      }
    }
  });

  var BuildView = Backbone.View.extend({
    el: $('#right'),
    initialize: function(build) {
      this.el.html($(templates['builds/show'](build.attributes)));
    }
  });

  var ApplicationController = Backbone.Controller.extend({
    routes: {
      '':                   'repositories_index',
      '!/repositories/:id': 'repositories_show',
      '!/builds/:id':       'builds_show'
    },
    initialize: function() {
      this.repositories = new Repositories(INIT_DATA.repositories);
      this.builds = new Builds;
      // should probably be in Repositories#initialize. how to properly pass the app instance?
      this.bind('build:created', this.repositories.build_created)
      this.bind('build:updated', this.repositories.build_updated)
      this.bind('build:finished', this.repositories.build_updated)
    },
    repositories_index: function() {
      this.repository = this.repositories[this.repositories.length - 1];
      this.render(this.render_repository);
    },
    repositories_show: function(id) {
      this.repository = this.repositories.detect(function(item) { return item.get('id') == parseInt(id) });
      this.render(this.render_repository);
    },
    builds_show: function(id) {
      this.build = new Build({ id: id });
      this.builds.add(this.build);
      this.build.fetch({ success: function(build) { this.render(this.render_build); }.bind(this)});
    },
    render: function(content) {
      this.render_repositories();
      content.apply(this)
    },
    render_repositories: function() {
      this.repositories_list = new RepositoriesListView(this.repositories);
      this.repositories_list.render();
    },
    render_repository: function() {
      this.repository_view = new RepositoryView(this.repository);
      this.repository_view.render();
    },
    render_build: function() {
      this.build_view = new BuildView(this.build);
      this.build_view.render();
    }
  });

  var templates = this.templates = {};
  $('script[type=text/x-js-template]').map(function() {
    templates[$(this).attr('name')] = Handlebars.compile($(this).html());
  });

  var app = new ApplicationController();
  Backbone.history.start();

  Socky.prototype.respond_to_connect = function() {
    var repository_ids = _.map(INIT_DATA.repositories, function(repository) { return repository.id });
    this.connection.send('subscribe:{"repository":[' + repository_ids.join(',') + ']}')
  }

  Socky.prototype.respond_to_message = function(msg) {
    var data = JSON.parse(msg);
    // console.log('-- trigger: ' + data.event + ' message: ' + data.message);
    app.trigger(data.event, _.extend(data.build, { log: data.message }));
  }

  // fake github pings
  $('.github_ping').click(function(event) {
    $.post($(this).attr('href'), { payload: $(this).attr('data-payload') });
    event.preventDefault();
  });

  $.fn.animateHighlight = function(highlightColor, duration) {
      var highlightBg = highlightColor || "#FFFF9C";
      var animateMs = duration || 1500;
      var originalBg = this.css("backgroundColor");
      this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
  };

  Util = {
    animated: function(element) {
      return !!element.queue()[0];
    },
    flash: function(element) {
      if(!Util.animated(element)) { Util._flash(element); }
    },
    _flash: function(element) {
      element.effect('highlight', {}, 1000, function () { Util._flash(element) });
    },
    unflash: function(element) {
      element.stop().css({ 'background-color': '', 'background-image': '' });
    },
    deansi: function(string) {
      return string.replace('[31m', '<span class="red">').replace('[32m', '<span class="green">').replace('[0m', '</span>');
    }
  }
});
