describe('Events:', function() {
  var it_prepends_to_the_jobs_list_view = function() {
    it('prepends to the jobs list view', function() {
      expect_text('#jobs li:first-child', this.data.repository.name + ' #' + this.data.number)
    });
  };

  var it_removes_the_job_from_the_jobs_list_view = function() {
    it('removes the job from the jobs list view', function() {
      expect($('#jobs li.empty').attr('style').match('display: none')).toBeFalsy();
    });
  };

  describe('the job queue', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      go_to('#!/' + this.repository.name)
    });

    describe('an incoming event for the current build', function() {
      describe('build:queued', function() {
        beforeEach(function() {
          this.data = build_queued_data(this.repository, { number: 2 });
          Travis.app.trigger('build:queued', this.data);
          waitsFor(jobs_list_populated(1));
        });

        it_prepends_to_the_jobs_list_view();
      });

      describe('build:started', function() {
        beforeEach(function() {
          this.data = build_started_data(this.repository);
          Travis.app.trigger('build:started', this.data);
        });

        it_removes_the_job_from_the_jobs_list_view();
      });
    });
  });
});

