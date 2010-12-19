beforeEach(function() {
  this.addMatchers({
    toBeEmpty: function() {
      return this.actual.children().size() == 0;
    }
  });
});
