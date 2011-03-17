describe('Fixtures:', function() {
  beforeEach(function() {
    jasmine.server.restore();
  });

  it('verifies the fixtures', function() {
    var paths = _.select(FIXTURES, function(path) { return !/jobs|workers/.test(path) });

    _.each(paths, function(path) {
      var fixture = jasmine.getFixture(path);
      var actual  = $.ajax(path.replace('models', '').replace('.json', ''), { async: false }).responseText;

      expect(JSON.parse(fixture)).toEqual(JSON.parse(actual));
    });
  })

});

