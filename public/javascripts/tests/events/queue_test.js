describe('Events:', function() {
  var it_prepends_to_the_queue_view = function(delay) {
    it('prepends to the queue view', function() {
      runs_after(delay, function() {
        expect_text('#queue', '#' + this.data.number)
      });
    });
  };

  describe('the job queue', function() {
    this.delay = 0;

    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      go_to('#!/' + this.repository.name)
    });

    describe('an incoming event for the current build', function() {
      describe('build:queued', function() {
        beforeEach(function() {
          runs_after(this.delay, function() {
            this.data = build_queued_data(this.repository);
            Travis.app.trigger('build:queued', this.data);
          });
        });

        it_prepends_to_the_queue_view();
      });

      // describe('build:finished', function() {
      //   beforeEach(function() {
      //     runs_after(this.delay, function() {
      //       this.data = _.extend(build_finished_data(this.repository), { finished_at: '2010-11-11T12:01:30Z' });
      //       Travis.app.trigger('build:finished', this.data);
      //     });
      //   });

      //   it_updates_the_repository_list_items_build_information();
      //   it_sets_the_repository_list_items_build_status_color();
      //   it_stops_the_repository_list_item_flashing();
      //   it_updates_the_build_summary();
      // });
    });
  });
});

