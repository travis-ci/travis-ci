describe('Builds', function() {
  beforeEach(function() {
    startApp();
    goTo('/');
    runsWhen(repositoriesFetched(), function() {
      expect(Travis.app.repositories).not.toBeEmpty();
    });
  });

  afterEach(function() {
    stopApp();
  });

  describe('getOrFetch given a child build id', function() {
    it('works', function() {
      var builds = Travis.app.repositories.get(1).builds;
      builds.remove(3);
      expect(builds.pluck('id')).toEqual([]);

      builds.getOrFetch(7);
      runsAfter(50, function() {
        expect(builds.pluck('id')).toEqual([3]);
        expect(builds.get(3).matrix.pluck('id')).toContain(7);
      })
    });
  });

  it('adds a normal build to the global Travis.app.builds collection', function() {
    var build = Travis.app.repositories.get('1').builds.first();
    expect(Travis.app.builds).not.toBeEmpty();
    expect(Travis.app.builds.get(build.id)).toEqual(build);
  });

  it("update adds a new child", function() {
    var collection = new Travis.Collections.Builds();
    collection.update({ id: 1, status: 1 });
    expect(collection.get(1).get('status')).toEqual(1);
  });

  it("update updates an existing build's attributes", function() {
    var collection = new Travis.Collections.Builds([{ id: 1 }]);
    collection.update({ id: 1, status: 1 });
    expect(collection.get(1).get('status')).toEqual(1);
  });

  it("update adds a new child", function() {
    var collection = new Travis.Collections.Builds([{ id: 1 }]);
    collection.update({ id: 1, status: 2, matrix: [{ id: 2, status: 1 }] });
    expect(collection.get(1).get('status')).toEqual(2);
    expect(collection.get(1).matrix.get(2).get('status')).toEqual(1);
  });

  it("update updates a child build's attributes", function() {
    var collection = new Travis.Collections.Builds([{ id: 1, status: 2, matrix: [
      { id: 2, started_at: 'Sun Apr 03 2011 00:00:00 GMT+0200 (CEST)' },
      { id: 3, started_at: 'Sun Apr 03 2011 00:01:00 GMT+0200 (CEST)' }
    ]}]);
    collection.update({ id: 1, matrix: [{ id: 2, status: 1 }] });
    expect(collection.get(1).get('status')).toEqual(2);
    expect(collection.get(1).matrix.get(2).get('started_at')).toEqual('Sun Apr 03 2011 00:00:00 GMT+0200 (CEST)');
    expect(collection.get(1).matrix.get(2).get('status')).toEqual(1);
    expect(collection.get(1).matrix.get(3).get('started_at')).toEqual('Sun Apr 03 2011 00:01:00 GMT+0200 (CEST)');
  });

  it('does not trigger :expanded if the build already has a matrix', function() {
    var triggered = false;
    var collection = new Travis.Collections.Builds([{ id: 1, status: 2, matrix: [
      { id: 2, started_at: 'Sun Apr 03 2011 00:00:00 GMT+0200 (CEST)' },
      { id: 3, started_at: 'Sun Apr 03 2011 00:01:00 GMT+0200 (CEST)' }
    ]}]);
    collection.bind('expanded', function() { triggered = true; });
    collection.update({ id: 1, matrix: [{ id: 2, status: 1 }] });
    expect(triggered).toBeFalsy();
  });

  it('triggers :expanded if the build has not had a matrix before and now has one', function() {
    var triggered = false;
    var collection = new Travis.Collections.Builds([{ id: 1, status: 2}]);
    collection.bind('expanded', function() { triggered = true; });
    collection.update({ id: 1, matrix: [{ id: 2, status: 1 }] });
    expect(triggered).toBeTruthy();
  });

});
