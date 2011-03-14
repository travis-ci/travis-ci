beforeEach(function() {
  this.addMatchers({
    toMatch: function(pattern) {
      return this.actual.match(pattern);
    },
    toBeEmpty: function() {
      return this.actual.length == 0;
    },
    toNotBeEmpty: function() {
      return this.actual.length > 0;
    }
  });
});
