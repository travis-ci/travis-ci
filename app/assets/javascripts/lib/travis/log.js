Travis.Log = {
  FOLDS: {
    schema:  /(<p.*?\/a>\$ (?:bundle exec )?rake( db:create)? db:schema:load[\s\S]*?<p.*?\/a>-- assume_migrated_upto_version[\s\S]*?<\/p>\n<p.*?\/a>.*<\/p>)/gm,
    migrate: /(<p.*?\/a>\$ (?:bundle exec )?rake( db:create)? db:migrate[\s\S]*== +\w+: migrated \(.*\) =+)/gm,
    bundle:  /(<p.*?\/a>\$ bundle install.*<\/p>\n(<p.*?\/a>(Updating|Using|Installing|Fetching|remote:|Receiving|Resolving).*?<\/p>\n|<p.*?\/a><\/p>\n)*)/gm,
    exec:    /(<p.*?\/a>[\/\w]*.rvm\/rubies\/[\S]*?\/(ruby|rbx|jruby) .*?<\/p>)/g
  },

  filter: function(log) {
    // log = this.stripPaths(log);
    log = this.escapeHtml(log);
    log = this.deansi(log);
    log = log.replace(/\r/g, '');
    log = this.numberLines(log);
    log = this.fold(log);
    log = log.replace(/\n/g, '');
    return log;
  },

  stripPaths: function(log) {
    return log.replace(/\/home\/vagrant\/builds(\/[^\/\n]+){2}\//g, '');
  },

  escapeHtml: function(log) {
    return Handlebars.Utils.escapeExpression(log);
  },

  escapeRuby: function(log) {
    return log.replace(/#<(\w+.*?)>/, '#&lt;$1&gt;');
  },

  numberLines: function(log) {
    var result = '';
    $.each(log.trim().split('\n'), function (ix, line) {
      var path = Travis.Log.location().replace(/\/L\d+/, '') + '/L' + (ix + 1);
      result += '<p><a href="%@" name="%@">%@</a>%@</p>\n'.fmt(path, path, (ix + 1), line.trim());
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
        return '<div class="fold ' + name + '">' + arguments[1].trim() + '</div>';
      });
    });
    return log;
  },

  unfold: function(log) {
    return log.replace(/<div class="fold[^"]*">([\s\S]*?)<\/div>/mg, '$1\n');
  },

  location: function() { // need something to spy on in tests
    return window.location.hash;
  }
};
