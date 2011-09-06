Travis.Helpers.Urls = {
  urlCurrent: function() {
    return '#!/' + this.get('_slug');
  }.property('_slug'),

  urlBuilds: function() {
    return '#!/' + this.get('_slug') + '/builds';
  }.property('_slug'),

  urlBuild: function() {
    return '#!/' + this.get('_slug') + '/builds/' + this.get('id');
  }.property('_slug', 'id'),

  urlLastBuild: function() {
    return '#!/' + this.get('_slug') + '/builds/' + this.get('lastBuildId');
  }.property('_slug', 'lastBuildId'),

  urlGithubRepository: function() {
    return 'http://github.com/' + this.get('_slug');
  }.property('_slug', 'commit'),

  urlGithubCommit: function() {
    return 'http://github.com/' + this.get('_slug') + '/commit/' + this.get('commit');
  }.property('_slug', 'commit'),

  urlGithubWatchers: function() {
    return 'http://github.com/' + this.get('_slug') + '/watchers';
  }.property('_slug', 'commit'),

  urlGithubNetwork: function() {
    return 'http://github.com/' + this.get('_slug') + '/network';
  }.property('_slug', 'commit'),

  urlAuthor: function() {
    return 'mailto:' + this.get('author_email');
  }.property('author_email'),

  urlCommitter: function() {
    return 'mailto:' + this.get('committer_email');
  }.property('committer_email'),

  _slug: function() {
    return this.getPath('repository.slug') || this.get('slug');
  }.property('repository.status', 'slug')
}
