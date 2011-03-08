describe('Models:', function() {
  describe('Build', function() {
    beforeEach(function() {
      var repositories = new Travis.Collections.Repositories(INIT_DATA.repositories);
      this.build = repositories.models[0].builds.last();
    });

    describe('isBuilding', function() {
      it('returns true if finished_at is falsy', function() {
        this.build.set({ finished_at: null });
        expect(this.build.isBuilding()).toBeTruthy();
      });

      it('returns false if finished_at is not undefined', function() {
        this.build.set({ finished_at: new Date });
        expect(this.build.isBuilding()).toBeFalsy();
      });
    });

    describe('change events', function() {
      it('triggers a "change" event when a finished_at attribute is passed', function() {
        expectTriggered(this.build, 'change', function() {
          this.build.set({ finished_at: 20 })
        }.bind(this));
      });
    });
  });
});
