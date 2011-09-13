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
  }.property('repository'),

  urlBuilds: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds';
  }.property('repository'),

  urlParentBuild: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds/' + this.getPath('build.parentId');
  }.property('repository', 'build'),

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
    // Also, wtf do i have to watch the status here. And what's a better solution?
  }.property('build.id'),

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
  }.property('repository', 'build'),

  urlGithubCommit: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/commit/' + this.getPath('build.commit');
  }.property('repository', 'build'),

  urlGithubWatchers: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/watchers';
  }.property('repository', 'build'),

  urlGithubNetwork: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/network';
  }.property('repository', 'build'),

  urlAuthor: function() {
    return 'mailto:' + this.getPath('build.author_email');
  }.property('build'),

  urlCommitter: function() {
    return 'mailto:' + this.getPath('build.committer_email');
  }.property('build'),
};
