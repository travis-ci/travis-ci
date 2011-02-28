describe('Events:', function() {
  var itPrependsToTheJobsListView = function() {
    it('prepends to the jobs list view', function() {
      expectText('#jobs li:first-child', this.data.repository.name + ' #' + this.data.number)
    });
  };

  var itRemovesTheJobFromTheJobsListView = function() {
    it('removes the job from the jobs list view', function() {
      expect($('#jobs li:not(.empty)')).toBeEmpty();
    });
  };

  describe('the job queue', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      goTo('#!/' + this.repository.name)
    });

    describe('an incoming event for the current build', function() {
      describe('build:queued', function() {
        beforeEach(function() {
          this.data = buildQueuedData(this.repository, { number: 2 });
          Travis.app.trigger('build:queued', this.data);
          waitsFor(jobsListPopulated(1));
        });

        itPrependsToTheJobsListView();
      });

      describe('build:started', function() {
        beforeEach(function() {
          this.data = buildStartedData(this.repository);
          Travis.app.trigger('build:started', this.data);
        });

        itRemovesTheJobFromTheJobsListView();
      });
    });
  });
});

