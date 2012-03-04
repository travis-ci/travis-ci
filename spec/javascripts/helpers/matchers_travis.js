$.extend(jasmine, {
  matchValues: function(selector, expected, errors, context) {
    if(typeof expected === 'object') {
      $.each(expected, function(name, expected) {
        var actual = $(selector, context);
        actual = name == 'text' ? actual.text() : actual.attr(name);
        if(!jasmine.doesMatchText(actual, expected)) {
          errors.push('expected "' + context.selector + ' ' + selector + '" to have the attribute ' + name + ': "' + expected + '", but actually has: "' + actual + '".');
        }
      });
    } else {
      var actual = $(selector, context).text();
      if(!jasmine.doesMatchText(actual, expected)) {
        errors.push('expected "' + context.selector + ' ' + selector + '" to have the text "' + expected + '", but actually has: "' + actual + '".');
      }
    }
  },

  listsRepository: function(element, repository, errors) {
    element = $(element);

    var expected = {
      'a:nth-child(1)': repository.get('slug'),
      'a:nth-child(2)': { text: '#' + repository.get('last_build_number'), href: '#!/%@/builds/%@'.fmt(repository.get('slug'), repository.get('last_build_id')) },
      '.duration':      { title: repository.get('last_build_started_at'), text: repository.get('formattedLastBuildDuration') },
      '.finished_at':   { title: repository.get('last_build_finished_at'), text: repository.get('formattedLastBuildFinishedAt') }
    };

    $.each(expected, function(selector, value) {
      jasmine.matchValues(selector, value, errors, element);
    });

    if(repository.get('selected') && !$(element).hasClass('selected')) {
      errors.push('expected "' + element.selector + '" to be selected but it is not.');
    } else if(!repository.get('selected') && $(element).hasClass('selected')) {
      errors.push('expected "' + element.selector + '" not to be selected but it is.');
    }

    var color = repository.get('color');
    if(color && !$(element).hasClass(color)) {
      errors.push('expected "' + element.selector + '" to be ' + repository.color + ' but it is not.');
    } else if($.keys(repository).indexOf('color') == -1 && !repository.color && $.any(['red', 'green'], function(color) { return $(element).hasClass(color) })) {
      errors.push('expected "' + element.selector + '" not to have a color class but it has.');
    }

    return errors.length == 0;
  },

  showsRepository: function(element, repository, errors) {
    element = $(element);

    var expected = {
      'h3 a':                    { href: 'http://github.com/' + repository.get('slug'), text: repository.get('slug') },
      '.github-stats .watchers': { href: 'http://github.com/' + repository.get('slug') + '/watchers' },
      '.github-stats .forks':    { href: 'http://github.com/' + repository.get('slug') + '/network' }
    };
    $.each(expected, function(selector, text) {
      jasmine.matchValues(selector, text, errors, element);
    });

    return errors.length == 0;
  },

  showsBuildSummary: function(element, build, errors) {
    element = $(element);

    var commit       = build.get('commit').slice(0, 7) + (build.get('branch') ? ' (%@)'.fmt(build.get('branch')) : '');
    var commitUrl    = 'http://github.com/' + build.getPath('repository.slug') + '/commit/' + build.get('commit');

    var expected = {
      '.summary .number':        build.get('number'),
      '.summary .commit-hash a': { text: commit, href: commitUrl },
      '.summary .committer a':   { text: build.get('committer_name'), href: 'mailto:' + build.get('committer_email') },
      '.summary .author a':      { text: build.get('author_name'), href: 'mailto:' + build.get('author_email') }
      // '.summary .duration':      { title: build.get('duration'), text: build.get('formattedDuration') },
      // '.summary .finished_at':   { title: build.get('finished_at'), text: build.get('formattedFinishedAt') },
    };

    $.each(expected, function(selector, text) {
      jasmine.matchValues(selector, text, errors, element);
    });

    // TODO after moving these to helpers it's hard to test this. maybe instead of adding helper methods to the view
    // rather use presenters? but how to wrap a RecordArray then?
    //
    // var color = build.get('color');
    // if(color && !$('.summary', element).closest('.build').hasClass(color)) {
    //   errors.push('expected "' + element.selector + '" to be ' + color + ' but it is not.');
    // } else if(!color && $.any(['red', 'green'], function(color) { return $('.summary', element).closest('.build').hasClass(color) })) {
    //   errors.push('expected "' + element.selector + '" not to have a color class but it has.');
    // }

    this.message = function() { return errors.join("\n"); };
    return errors.length == 0;
  },

  showsBuildLog: function(element, log, errors) {
    var actual = $(element).find('.log p').html();
    log = $(log).html();
    if(actual != log) {
      errors.push('expected "' + element.selector + '.log" to show the log "' + log + '", but it shows "' + actual + '".');
    }
    return errors.length == 0;
  },

  showsActiveTab: function(element, tab, errors) {
    element = $(element);
    if(!$('#tab_' + tab, element).hasClass('active')) {
      errors.push('expected the tab "' + tab + '" to be active, but it is not.');
    }
    return errors.length == 0;
  }
});

beforeEach(function() {
  this.addMatchers({
    toListRepositories: function(repositories) {
      var errors   = [];
      this.message = function() { return errors.join("\n"); };

      var result = true;
      $.each(repositories.toArray(), function(ix, repository) {
        var element = $('.repository:nth-child(%@)'.fmt(ix + 1), this.actual);
        result &= jasmine.listsRepository(element, repository, errors);
      });
      return result;
    },

    toListRepository: function(repository) {
      var errors  = [];
      this.message = function() { return errors.join("\n"); };
      return jasmine.listsRepository(this.actual, repository, errors);
    },

    toShowRepository: function(repository) {
      var errors = [];
      this.message = function() { return errors.join("\n"); };
      return jasmine.showsRepository(this.actual, repository, errors);
    },

    toShowBuildSummary: function(build) {
      var errors = [];
      this.message = function() { return errors.join("\n"); };
      return jasmine.showsBuildSummary(this.actual, build, errors);
    },

    toShowBuildLog: function(log) {
      var errors = [];
      this.message = function() { return errors.join("\n"); };
      return jasmine.showsBuildLog(this.actual, log, errors);
    },

    toShowActiveTab: function(tab) {
      var errors = [];
      this.message = function() { return errors.join("\n"); };
      return jasmine.showsActiveTab(this.actual, tab, errors);
    }
  });
});

