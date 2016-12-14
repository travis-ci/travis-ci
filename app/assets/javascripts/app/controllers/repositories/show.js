//= require app/controllers/tabs.js
// __TESTING__ = true
Travis.Controllers.Repositories.Show = Ember.Object.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#repository',
    tabs: {
      current:  Travis.Controllers.Builds.Show,
      history:  Travis.Controllers.Builds.List,
      build:    Travis.Controllers.Builds.Show,
      job:      Travis.Controllers.Jobs.Show,
      branch_summary: Travis.Controllers.Repositories.BranchSummary
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

    // TODO: FIXME
    // Delaying the call as branch selector is not yet on the page (looks like view is not completely rendered at the moment).
    Ember.run.later(this, this._setTooltips, 1000);
    Ember.run.later(this, this._updateGithubBranches, 1000);
  },

  _setTooltips: function() {
    $(".tool-tip").tipsy();
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
    if(repository && repository.get('slug')) $.getJSON('http://github.com/api/v2/json/repos/show/' + repository.get('slug') + '?callback=?', function(data) {
      var element = $('.github-stats');
      element.find('.watchers').attr('href', repository.get('urlGithubWatchers')).text(data.repository.watchers);
      element.find('.forks').attr('href',repository.get('urlGithubNetwork')).text(data.repository.forks);
      element.find('.github-admin').attr('href', repository.get('urlGithubAdmin'));
    });
  }.observes('repository.slug'),

  _updateGithubBranches: function() {
    if(window.__TESTING__) return;
    var selector = $(this.branchSelector);
    var repository = this.get('repository');

    selector.empty();
    $('.tools input').val('');

    // Seeing 404 when hitting travis-ci.org/ as repository exists (BUSY_LOADING?) and slug is null
    // So let's ensure that the slug is populated before making this request.
    if (selector.length > 0 && repository && repository.get('slug')) {
      $.getJSON('http://github.com/api/v2/json/repos/show/' + repository.get('slug') + '/branches?callback=?', function(data) {
        var branches = $.map(data['branches'], function(commit, name) { return name; }).sort();

        // TODO: FIXME
        // Clear selector again as observing 'repository.slug' causes this method (as well as _updateGithubStats) being
        // called twice while switching repository. That results in two identical API calls that lead to selector being
        // updated twice too.
        selector.empty();
        $.each(branches, function(index, branch) { $('<option>', { value: branch }).html(branch).appendTo(selector); });
        selector.val('master');

        this._updateStatusImageCodes();
      }.bind(this));
    }
  }.observes('repository.slug'),

  _updateStatusImageCodes: function() {
    var imageUrl = this.get('_statusImageUrl');
    var repositoryUrl = this.get('_repositoryUrl');

    if (repositoryUrl && imageUrl) {
      $('.tools input.url').val(imageUrl);
      $('.tools input.markdown').val('[![Build Status](' + imageUrl + ')](' + repositoryUrl + ')');
      $('.tools input.textile').val('!' + imageUrl + '(Build Status)!:' + repositoryUrl);
      $('.tools input.rdoc').val('{<img src="' + imageUrl + '" alt="Build Status" />}[' + repositoryUrl + ']');
    } else {
      $('.tools input').val('');
    }
  },

  _statusImageUrl: function() {
    var branch = $(this.branchSelector).val();
    if (branch && this.repository.get('slug')) {
      return 'https://secure.travis-ci.org/' + this.repository.get('slug') + '.png?branch=' + branch;
    }
  }.property('repository.slug'),

  _repositoryUrl: function() {
    if (this.repository.get('slug')) return 'http://travis-ci.org/' + this.repository.get('slug');
  }.property('repository.slug'),

  repositoryDidChange: function() {
    this.repository.select();
  }.observes('repository')
});
