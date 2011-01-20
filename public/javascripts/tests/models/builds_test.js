describe('Models:', function() {
  describe('Builds', function() {
    beforeEach(function() {
      var repositories = new Repositories(INIT_DATA.repositories);
      this.builds = repositories.models[1].builds;
    });

    describe('set', function() {
      it('adds a new build for a non-existing id', function() {
        var build_id = 1;
        this.builds.set({ id: build_id, commit: '123456' });
        expect(this.builds.get(build_id).get('commit')).toEqual('123456');
      });

      it('sets the given attributes to an existing build', function() {
        var build_id = this.builds.models[0].get('id');
        this.builds.set({ id: build_id, commit: '123456' });
        expect(this.builds.get(build_id).get('commit')).toEqual('123456');
      });
    });

    describe('load', function() {
      it('loads the build history from remote', function() {
        runs(function() {
          this.builds.load();
        });
        runs_after(400, function() {
          expect(this.builds.models.length).toEqual(3);
          var attributes = _.pluck(this.builds.models, 'attributes');
          expect(_.pluck(attributes, 'number')).toEqual([1, 2, 3]);
        });
      });
    });
  });
});


