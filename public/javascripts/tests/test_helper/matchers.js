beforeEach(function() {
  this.addMatchers({
    toMatch: function(pattern) {
      this.actual = $(this.actual);
      return this.actual.match(pattern);
    },
    toBeEmpty: function() {
      this.actual = $(this.actual);
      return this.actual.length == 0;
    },
    toFind: function(selector) {
      this.actual = $(this.actual);
      return this.actual.find(selector).length != 0;
    },
    toHaveDomAttributes: function(attributes) {
      this.actual = $(this.actual);
      var errors = [];
      _.each(attributes, function(attributes, selector) {
        _.each(attributes, function(value, name) {
          var actual = $.trim($(this.actual).find(selector).attr(name));
          if(typeof text == 'function' ? !actual.test(value) :  actual != value) {
            errors.push('expected the element ' + selector + ' to have the attribute ' + name + '=' + value +', but actually has: "' + actual + '".');
          }
        }.bind(this));
      }.bind(this));
      this.message = function() { return errors.join("\n") };
      return errors.length == 0;
    },
    toHaveTexts: function(texts) {
      this.actual = $(this.actual);
      var errors = [];
      _.each(texts, function(text, selector) {
        var actual = $.trim($(this.actual).find(selector).text());
        if(!jasmine.match(actual, text)) {
          errors.push('expected the element ' + selector + ' to have the text "' + text +'", but actually has: "' + actual + '".');
        }
      }.bind(this));
      this.message = function() { return errors.join("\n") };
      return errors.length == 0;
    },
    toHaveText: function(text) {
      this.actual = $(this.actual);
      var actual = $.trim($(this.actual).text());
      this.message = function() {
        return 'expected the element ' + this.actual.selector + ' to have the text "' + text +'", but actually has: "' + actual + '".';
      }
      return jasmine.match(actual, text);
    },
    toMatchTable: function(table) {
      table = _.clone(table);

      this.actual = $(this.actual);
      var errors = [];
      var headers = table.shift();

      _.each(headers, function(text, ix) {
        var selector = 'thead th:nth-child(' + (ix + 1) + ')';
        var actual = $.trim($(this.actual).find(selector).text());
        if(!jasmine.match(actual, text)) {
          errors.push('expected the header ' + ix + ' to have the text "' + text + '", but actually has: "' + actual + '".');
        }
      }.bind(this));

      _.each(table, function(cells, row) {
        _.each(cells, function(text, cell) {
          var selector = 'tbody tr:nth-child(' + (row + 1) + ') td:nth-child(' + (cell + 1) + ')';
          var actual = this.actual.find(selector).text();
          if(!jasmine.match(actual, text)) {
            errors.push('expected the cell "' + headers[cell] + '" in row ' + row + ' to have the text "' + text + '", but actually has: "' + actual + '".');
          }
        }.bind(this));
      }.bind(this));

      this.message = function() { return errors.join("\n"); }
      return errors.length == 0;
    },
    toListRepository: function(repository) {
      this.actual = $(this.actual);
      var errors = [];

      var expectations = {
        'a:nth-child(1)': repository.slug,
        'a:nth-child(2)': '#' + repository.build,
        '.duration': repository.duration,
        '.finished_at': repository.finished_at
      };
      _.each(expectations, function(text, selector) {
        var actual = $(selector, this.actual).text();
        if(!jasmine.match(actual, text)) {
          errors.push('expected "' + this.actual.selector + ' ' + selector + '" to have the text "' + text + '", but actually has: "' + actual + '".');
        }
      }.bind(this));

      if(repository.selected && !$(this.actual).hasClass('selected')) {
        errors.push('expected "' + this.actual.selector + '" to be selected but it is not.');
      } else if(!repository.selected && $(this.actual).hasClass('selected')) {
        errors.push('expected "' + this.actual.selector + '" not to be selected but it is.');
      }

      if(repository.color && !$(this.actual).hasClass(repository.color)) {
        errors.push('expected "' + this.actual.selector + '" to be ' + repository.color + ' but it is not.');
      } else if(_.include(_.keys(repository), 'color') && !repository.color && _.any(['red', 'green'], function(color) { return $(this.actual).hasClass(color) })) {
        errors.push('expected "' + this.actual.selector + '" not to have a color class but it has.');
      }

      this.message = function() { return errors.join("\n"); };
      return errors.length == 0;
    },
    toShowBuildSummary: function(summary) {
      this.actual = $(this.actual);
      var errors = [];

      var expectations = {
        '.summary .number': summary.build,
        '.summary .commit-hash': summary.commit,
        '.summary .committer': summary.committer,
        '.summary .duration': summary.duration,
        '.summary .finished_at': summary.finished_at
        // FIXME
        // '.author': summary.author,
      }

      _.each(expectations, function(text, selector) {
        var actual = $(selector, this.actual).text();
        if(!jasmine.match(actual, text)) {
          errors.push('expected "' + this.actual.selector + ' ' + selector + '" to have the text "' + text + '", but actually has: "' + actual + '".');
        }
      }.bind(this));

      if(summary.color && !$('.summary', this.actual).hasClass(summary.color)) {
        errors.push('expected "' + this.actual.selector + '" to be ' + summary.color + ' but it is not.');
      } else if(_.include(_.keys(summary), 'color') && !summary.color && _.any(['red', 'green'], function(color) { return $('.summary', this.actual).hasClass(color) })) {
        errors.push('expected "' + this.actual.selector + '" not to have a color class but it has.');
      }

      this.message = function() { return errors.join("\n"); };
      return errors.length == 0;
    },
    toShowActiveTab: function(tab) {
      this.actual = $(this.actual);
      var errors = [];

      if(!$('#tab_' + tab, this.actual).hasClass('active')) {
        errors.push('expected the tab "' + tab + '" to be active, but it is not.');
      }

      this.message = function() { return errors.join("\n"); };
      return errors.length == 0;
    },
    toShowBuildLog: function(log) {
      this.actual = $(this.actual);
      var errors = [];
      var actual = $('.log', this.actual).text();

      if(actual != log) {
        errors.push('expected "' + this.actual.selector + ' .log" to show the log "' + log + '", but it shows "' + actual + '".');
      }

      this.message = function() { return errors.join("\n"); };
      return errors.length == 0;
    },
  });
});

jasmine.match = function (lft, rgt) {
  return typeof rgt == 'function' ? rgt.test(lft) : lft == rgt;
}
