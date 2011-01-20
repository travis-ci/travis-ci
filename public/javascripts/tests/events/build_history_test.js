describe('Events:', function() {
  describe('on the build history view', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      go_to('#!/' + this.repository.name + '/builds')
      waitsFor(build_tab_active(this.repository.name, 'history'));
      waits(400); // TODO ugh ...
    });

    describe('an incoming event for the current build', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = _.extend(build_started_data(this.repository), { number: 4 });
          Travis.app.trigger('build:started', this.data);
          waitsFor(build_history_contains_rows(2));
        });

        it_prepends_the_build_to_the_builds_history_table();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = _.extend(build_finished_data(this.repository), { finished_at: '2010-11-11T12:01:30Z' });
          Travis.app.trigger('build:finished', this.data);
        });

        it_updates_the_builds_history_table_row();
      });
    });

    describe('an incoming event for a different build', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = _.extend(build_started_data(INIT_DATA.repositories[0]), { number: 4 });
          Travis.app.trigger('build:started', this.data);
        });

        it_does_not_prepend_the_build_to_the_builds_history_table();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = _.extend(build_finished_data(INIT_DATA.repositories[0]), { finished_at: '2010-11-11T12:01:30Z' });
          Travis.app.trigger('build:finished', this.data);
        });

        it_does_not_update_the_builds_history_table_row();
      });
    });
  });
});
