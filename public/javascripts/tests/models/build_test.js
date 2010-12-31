describe('Models:', function() {
  describe('Build', function() {
    beforeEach(function() {
      var repositories = new Repositories(INIT_DATA.repositories);
      this.build = repositories.models[0].builds.last();
    });

    describe('is_building', function() {
      it('returns true if finished_at is falsy', function() {
        this.build.set({ finished_at: null });
        expect(this.build.is_building()).toBeTruthy();
      });

      it('returns false if finished_at is not undefined', function() {
        this.build.set({ finished_at: new Date });
        expect(this.build.is_building()).toBeFalsy();
      });
    });

    describe('change events', function() {
      it('triggers a "change" event when a finished_at attribute is passed', function() {
        expect_triggered(this.build, 'change', function() {
          this.build.set({ finished_at: 20 })
        }.bind(this));
      });
    });
  });
});
