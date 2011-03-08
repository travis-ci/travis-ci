beforeEach(function() {
  this.addMatchers({
    toMatch: function(pattern) {
      return this.actual.match(pattern);
    },
    toBeEmpty: function() {
      return this.actual.children().size() == 0;
    }
  });
});
