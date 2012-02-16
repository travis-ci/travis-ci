//= require app/controllers/tabs.js

Travis.Controllers.Repositories.Show = Ember.Object.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#repository',
    tabs: {
      current: Travis.Controllers.Builds.Show,
      history: Travis.Controllers.Builds.List,
      build:   Travis.Controllers.Builds.Show,
      job:     Travis.Controllers.Jobs.Show
    }
  }),

  repositoryBinding: '_repositories.firstObject',
  buildBinding: '_buildProxy.content',

  init: function() {
    this._super();
    this.tabs.parent = this;
    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildBinding: 'controller.build',
      jobBinding: 'controller.job',
      templateName: 'app/templates/repositories/show'
    });
    this.view.appendTo('#main');

    this.branchSelector = '.tools select';
    $(this.branchSelector).live('change', this._updateStatusImageCodes.bind(this));
  },

  activate: function(tab, params) {
    this.set('params', params);

    if(tab == 'current') {
      this.set('_buildProxy', Ember.Object.create({ parent: this, contentBinding: 'parent.repository.lastBuild' }));
      this.set('job', undefined);
    } else if(tab == 'build') {
      this.set('_buildProxy', Ember.Object.create({ parent: this, content: Travis.Build.find(params.id) }));
      this.set('job', undefined);
    } else if(tab == 'job') {
      this.set('_buildProxy', Ember.Object.create({ parent: this, contentBinding: 'parent.job.build' }));
      this.set('job', Travis.Job.find(params.id));
    }
    this.tabs.activate(tab);
  },

  _repositories: function() {
    var slug = this.get('_slug');
    return slug ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
  }.property('_slug'),

  _slug: function() {
    var parts = $.compact([this.getPath('params.owner'), this.getPath('params.name')]);
    if(parts.length > 0) return parts.join('/');
  }.property('params'),

  _updateGithubStats: function() {
    if(window.__TESTING__) return;
    var repository = this.get('repository');
    if(repository) $.getJSON('http://github.com/api/v2/json/repos/show/' + repository.get('slug') + '?callback=?', function(data) {
      var element = $('.github-stats');
      element.find('.watchers').attr('href', repository.get('urlGithubWatchers')).text(data.repository.watchers);
      element.find('.forks').attr('href',repository.get('urlGithubNetwork')).text(data.repository.forks);
      element.find('.github-admin').attr('href', repository.get('urlGithubAdmin'));
    });
  }.observes('repository.slug'),

  _updateGithubBranches: function() {
    var repository = this.get('repository');
    if (!repository) return;

    var selector = $(this.branchSelector);
    selector.children().remove();

    $.getJSON('http://github.com/api/v2/json/repos/show/' + repository.get('slug') + '/branches?callback=?', function(data) {
      if (selector.children().length == 0) {
        $.each($.map(data['branches'], function(commit, name) { return name; }).sort(), function(index, branch) {
          $('<option>', { value: branch }).html(branch).appendTo(selector);
        });
        selector.val('master');
        this._updateStatusImageCodes();
      }
    }.bind(this));
  }.observes('repository.slug'),

  _updateStatusImageCodes: function() {
    $('.tools input.url').val(this.get('_statusImageUrl'));
    $('.tools input.markdown').val('[![Build Status](' + this.get('_statusImageUrl') + ')](' + this.get('_repositoryUrl') + ')');
  },

  _statusImageUrl: function() {
    return 'https://secure.travis-ci.org/' + this.repository.get('slug') + '.png?branch=' + $(this.branchSelector).val();
  }.property('repository.slug'),

  _repositoryUrl: function() {
    return 'http://travis-ci.org/' + this.repository.get('slug');
  }.property('repository.slug'),

  repositoryDidChange: function() {
    this.repository.select();
  }.observes('repository')
});
