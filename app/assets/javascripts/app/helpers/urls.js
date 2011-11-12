// This seems quite ugly as it is mixed into two models. What's a better
// approach for url generation helpers in sproutcore?

Travis.Helpers.Urls = {
  urlCurrent: function() {
    // OMFG, HAX.
    // I'm not able to bind the build and repository to the item views of the matrix collection
    // view properly. See templates/builds/show.jst.hjs
    if(this.getPath('parentView.tagName') == 'ul') {
      return '#!/' + this.getPath('content.slug');
    } else {
      return '#!/' + this.getPath('repository.slug');
    }
  }.property('content', 'repository'),

  urlBuilds: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds';
  }.property('repository'),

  urlParentBuild: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds/' + this.getPath('build.parentId');
  }.property('repository.slug', 'build.parent_id'),

  urlBuild: function() {
    // OMFG, HAX.
    // I'm not able to bind the build and repository to the item views of the matrix collection
    // view properly. See templates/builds/show.jst.hjs
    if(this.getPath('parentView.tagName') == 'tbody') {
      var slug = this.getPath('parentView.parentView.parentView.repository.slug') || this.getPath('parentView.parentView.repository.slug');
      return '#!/' + slug + '/builds/' + this.getPath('content.id');
    } else {
      return '#!/' + this.getPath('repository.slug') + '/builds/' + this.getPath('build.id');
    }
  }.property('repository.slug', 'build.id'),

  urlLastBuild: function() {
    // OMFG, HAX.
    // I'm not able to bind the build and repository to the item views of the matrix collection
    // view properly. See templates/builds/show.jst.hjs
    if(this.getPath('parentView.tagName') == 'ul') {
      return '#!/' + this.getPath('content.slug') + '/builds/' + this.getPath('content.lastBuildId');
    } else {
      return '#!/' + this.getPath('repository.slug') + '/builds/' + this.getPath('repository.lastBuildId');
    }
  }.property('repository'),

  urlGithubRepository: function() {
    return 'http://github.com/' + this.getPath('repository.slug');
  }.property('repository.slug'),

  urlGithubCommit: function() {
    // OMFG, HAX.
    // I'm not able to bind the build and repository to the item views of the matrix collection
    // view properly. See templates/builds/show.jst.hjs
    if(this.getPath('parentView.tagName') == 'tbody') {
      var slug = this.getPath('parentView.parentView.parentView.repository.slug') || this.getPath('parentView.parentView.repository.slug');
      return '#!/' + slug + '/builds/' + this.getPath('content.id');
    } else {
      return 'http://github.com/' + this.getPath('repository.slug') + '/commit/' + this.getPath('build.commit');
    }
  }.property('repository.slug', 'build.commit'),

  urlGithubWatchers: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/watchers';
  }.property('repository.slug'),

  urlGithubNetwork: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/network';
  }.property('repository.slug'),

  urlGithubAdmin: function() {
    return this.getPath('content.url') + '/admin/hooks#travis_minibucket';
  }.property('content.slug'),

  urlAuthor: function() {
    return this.getPath('build.authorMailToEmail');
  }.property('build.authorMailToEmail'),

  urlCommitter: function() {
    return this.getPath('build.committerMailToEmail');
  }.property('build.committerMailToEmail')
};
