describe('Events:', function() {
  describe('on the repository view (current build tab)', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      go_to('#!/' + this.repository.name)
      waitsFor(repositories_list_populated(2));
    });

    describe('an incoming event for a new repository', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = new_repository_data();
          Travis.app.trigger('build:started', this.data);
        });

        it_adds_the_repository_to_the_repositories_collection();
        it_prepends_the_repository_to_the_repositories_list();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = new_repository_data();
          Travis.app.trigger('build:finished', this.data);
        });

        it_prepends_the_repository_to_the_repositories_list();
      });
    });

    describe('an incoming event for the current repository', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = build_started_data(this.repository);
          Travis.app.trigger('build:started', this.data)
        });

        it_adds_the_build_to_the_repositorys_builds_collection();
        it_updates_the_repository_list_items_build_information();
        /* it_makes_the_repository_list_item_flash(); */
        it_updates_the_build_summary();
      });

      describe('build:log', function() {
        beforeEach(function() {
          this.data = build_log_data(this.repository, { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        it_appends_to_the_build_log();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = build_finished_data(this.repository);
          Travis.app.trigger('build:finished', this.data);
        });

        it_updates_the_repository_list_items_build_information();
        it_sets_the_repository_list_items_build_status_color();
        /* it_stops_the_repository_list_item_flashing(); */
        it_updates_the_build_summary();
      });
    });

    describe('an incoming event for a different repository', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = _.extend(build_started_data(INIT_DATA.repositories[0]), { number: 4 });
          Travis.app.trigger('build:started', this.data);
        });

        it_updates_the_repository_list_items_build_information();
        /* it_makes_the_repository_list_item_flash(); */
        it_does_not_update_the_build_summary();
      });

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
        /* it_stops_the_repository_list_item_flashing(); */
        it_does_not_update_the_build_summary();
      });
    });
  });
});

