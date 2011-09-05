Travis.Helpers.Urls = {
  urlCurrent: function() {
    return '#!/' + this.getSlug();
  }.property('slug'),

  urlBuilds: function() {
    return '#!/' + this.getSlug() + '/builds';
  }.property('slug'),

  urlBuild: function() {
    return '#!/' + this.getSlug() + '/builds/' + this.get('id');
  }.property('slug', 'id'),

  urlLastBuild: function() {
    return '#!/' + this.getSlug() + '/builds/' + this.get('lastBuildId');
  }.property('slug', 'lastBuildId'),

  urlGithubRepository: function() {
    return 'http://github.com/' + this.getSlug();
  }.property('slug', 'commit'),

  urlGithubCommit: function() {
    return 'http://github.com/' + this.getSlug() + '/commit/' + this.get('commit');
  }.property('slug', 'commit'),

  urlGithubWatchers: function() {
    return 'http://github.com/' + this.getSlug() + '/watchers';
  }.property('slug', 'commit'),

  urlGithubNetwork: function() {
    return 'http://github.com/' + this.getSlug() + '/network';
  }.property('slug', 'commit'),

  urlAuthor: function() {
    return 'mailto:' + this.get('author_email');
  }.property('author_email'),

  urlCommitter: function() {
    return 'mailto:' + this.get('committer_email');
  }.property('committer_email'),

  getSlug: function() {
    return this.getPath('repository.slug') || this.get('slug');
  }
}
