describe('Events:', function() {
  describe('on the build view', function() {
    this.delay = 0;

    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      go_to('#!/' + this.repository.name + '/builds/' + this.repository.last_build.id)
      waitsFor(repositories_list_populated(2));
    });

    describe('an incoming event for the current build', function() {
      describe('build:log', function() {
        beforeEach(function() {
          this.data = build_log_data(this.repository, { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        it_appends_to_the_build_log();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = _.extend(build_finished_data(this.repository), { finished_at: '2010-11-11T12:01:30Z' });
          Travis.app.trigger('build:finished', this.data);
        });

        it_updates_the_repository_list_items_build_information();
        it_sets_the_repository_list_items_build_status_color();
        it_stops_the_repository_list_item_flashing();
        it_updates_the_build_summary();
      });
    });

    describe('an incoming event for a different build', function() {
      describe('build:log', function() {
        beforeEach(function() {
          this.data = build_log_data(INIT_DATA.repositories[0], { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        it_does_not_append_to_the_build_log();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = build_finished_data(INIT_DATA.repositories[0]);
          Travis.app.trigger('build:finished', this.data);
        });

        it_updates_the_repository_list_items_build_information();
        it_sets_the_repository_list_items_build_status_color();
        it_stops_the_repository_list_item_flashing();
        it_does_not_update_the_build_summary();
      });
    });
  });
});
