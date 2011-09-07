Travis.Log = function() {
};

$.extend(Travis.Log.prototype, {
  filter: function(log) {
    log = this.stripPaths(log);
    log = this.escapeHtml(log);
    log = this.fold(log);
    log = this.deansi(log);
    log = this.numberLines(log);
    return log;
  },

  stripPaths: function(log) {
    return log.replace(/\/tmp\/travis\/builds(\/[^\/\n]+){2}\//g, '');
  },

  escapeHtml: function(log) {
    return Handlebars.Utils.escapeExpression(log);
  },

  escapeRuby: function(log) {
    return log.replace(/#<(\w+.*?)>/, '#&lt;$1&gt;');
  },

  numberLines: function(log) {
    var result = '';
    $.each(log.split('\n'), function (ix, line) {
      var path = Travis.Log.location().replace(/\/L\d+/, '') + '/L' + (ix + 1);
      result += '<p><a href="%@" name="%@">%@</a>%@</p>\n'.fmt(path, path, (ix + 1), line);
    })
    return result.trim();
  },

  deansi: function(log) {
    return Deansi.parse(log);
  },

  fold: function(log) {
    log = this.unfold(log);
    $.each(Travis.Log.FOLDS, function(name, pattern) {
      log = log.replace(pattern, function() {
        return arguments[1] + '<div class="fold ' + name + '">' + arguments[2].trim() + '</div>';
      });
    });
    return log;
  },

  unfold: function(log) {
    return log.replace(/<div class="fold[^"]*">([\s\S]*?)<\/div>/mg, '$1\n');
  },
});

$.extend(Travis.Log, {
  FOLDS: {
    bundle:  /(^|<\/div>)(\$ bundle install.*\n+(?:(Fetching|Updating|Using|Installing).*?\n+)*)/gm,
    migrate: /(^|<\/div>)(\$ (?:bundle exec )?rake [\s\S]*db:migrate[\s\S]*\n+(?:^== +\w+: migrated \(.*\) =+\n+))/gm,
    schema:  /(^|<\/div>)(\$ (?:bundle exec )?rake db:schema:load[\s\S]*(?:^-- assume_migrated_upto_version[\s\S]*\n))/gm,
    exec:    /(^|<\/div>)([\/\w]*.rvm\/rubies\/\S*?\/(ruby|rbx|jruby) [\s\S]*)/gm
  },

  location: function() { // need something to spy on in tests
    return window.location.hash;
  }
});
