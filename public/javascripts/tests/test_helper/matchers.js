beforeEach(function() {
  this.addMatchers({
    toMatch: function(pattern) {
      return this.actual.match(pattern);
    },
    toBeEmpty: function() {
      return this.actual.length == 0;
    },
    toFind: function(selector) {
      return this.actual.find(selector).length != 0;
    },
    toHaveDomAttributes: function(attributes) {
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
      var actual = $.trim($(this.actual).text());
      this.message = function() {
        return 'expected the element ' + this.actual.selector + ' to have the text "' + text +'", but actually has: "' + actual + '".';
      }
      return jasmine.match(actual, text);
    },
    toMatchTable: function(table) {
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
    }
  });
});

jasmine.match = function (lft, rgt) {
  return typeof rgt == 'function' ? rgt.test(lft) : lft == rgt;
}
