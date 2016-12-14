beforeEach(function() {
  this.addMatchers({
    toMatch: function(pattern) {
      return this.actual.match(pattern);
    },

    toFind: function(selector) {
      this.actual = $(this.actual);
      return this.actual.find(selector).length != 0;
    },

    toHaveTexts: function(texts) {
      this.actual = $(this.actual);
      var errors = [];
      _.each(texts, function(text, selector) {
        var actual = $.trim($(this.actual).find(selector).text());
        if(!jasmine.doesMatchText(actual, text)) {
          errors.push('expected the element ' + selector + ' to have the text "' + text +'", but actually has: "' + actual + '".');
        }
      }.bind(this));
      this.message = function() { return errors.join("\n") };
      return errors.length == 0;
    },

    toHaveText: function(text) {
      this.actual = $(this.actual);
      var actual = $(this.actual).text().replace(/^\s*|\s(?=\s)|\s*$/g, '').trim();
      this.message = function() {
        return 'expected the element ' + this.actual.selector + ' to have the text "' + text +'", but actually has: "' + actual + '".';
      };
      return jasmine.doesMatchText(actual, text);
    },

    toHaveDomAttributes: function(attributes) {
      this.actual = $(this.actual);
      var errors = [];
      _.each(attributes, function(attributes, selector) {
        _.each(attributes, function(value, name) {
          var actual = $.trim($(this.actual).find(selector).attr(name));
          if(typeof actual == 'function' ? !actual.test(value) :  actual != value) {
            errors.push('expected the element ' + selector + ' to have the attribute ' + name + '=' + value +', but actually has: "' + actual + '".');
          }
        }.bind(this));
      }.bind(this));
      this.message = function() { return errors.join("\n") };
      return errors.length == 0;
    },

    toMatchList: function(list) {
      var actual = $.map($('li', this.actual), function(li) { return $(li).text().replace(/\n/g, '').replace(/^\s*|\s(?=\s)|\s*$/g, '').trim(); });
      var result = Ember.compare(actual, list) == 0;
      if(!result) {
        this.message = function() { return "expected the list to equal \n  " + Ember.inspect(list) + ",\n\n but was: \n  " + Ember.inspect(actual) + "\n"; }
      }
      return result;
    },

    toMatchTable: function(table) {
      // table = $.clone(table);

      var actual = $(this.actual);
      var errors = [];
      var headers = table.shift();

      $.each(headers, function(ix, text) {
        var selector = 'thead th:nth-child(' + (ix + 1) + ')';
        var current = $.trim($(actual).find(selector).text());
        if(!jasmine.doesMatchText(current, text)) {
          errors.push('expected the header ' + ix + ' to have the text "' + text + '", but actually has: "' + actual + '".');
        }
      });

      $.each(table, function(row, cells) {
        $.each(cells, function(cell, text) {
          var selector = 'tbody tr:nth-child(' + (row + 1) + ') td:nth-child(' + (cell + 1) + ')';
          var current = actual.find(selector).text();
          if(!jasmine.doesMatchText(current, text)) {
            errors.push('expected the cell "' + headers[cell] + '" in row ' + row + ' to have the text "' + text + '", but actually has: "' + actual + '".');
          }
        });
      });

      this.message = function() { return errors.join("\n"); };
      return errors.length == 0;
    }
  });
});

jasmine.doesMatchText = function (lft, rgt) {
  if(lft == 'undefined') {
    return rgt === undefined;
  } else if(typeof rgt === 'function') {
    return rgt.test(lft);
  } else {
    return lft == rgt;
  }
};
