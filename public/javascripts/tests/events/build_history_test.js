describe('Events:', function() {
  describe('on the build history view', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      goTo('#!/' + this.repository.name + '/builds')
      waitsFor(buildTabActive(this.repository.name, 'history'));
      waitsFor(buildTabLoaded(this.repository.name, 'history'));
      waitsFor(buildHistoryTimesUpdated(), 1000, 'the build history timestamps have been updated to relative times in words');
    });

    describe('an incoming event for the current build', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = _.extend(buildStartedData(this.repository), { number: 4 });
          Travis.app.trigger('build:started', this.data);
          waitsFor(buildHistoryShowsBuilds(2));
        });

        itPrependsTheBuildToTheBuildsHistoryTable();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = _.extend(buildFinishedData(this.repository), { finished_at: '2010-11-11T12:01:30Z' });
          Travis.app.trigger('build:finished', this.data);
        });

        itUpdatesTheBuildsHistoryTableRow();
      });
    });

    describe('an incoming event for a different build', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = _.extend(buildStartedData(INIT_DATA.repositories[0]), { number: 4 });
          Travis.app.trigger('build:started', this.data);
        });

        itDoesNotPrependTheBuildToTheBuildsHistoryTable();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = _.extend(buildFinishedData(INIT_DATA.repositories[0]), { finished_at: '2010-11-11T12:01:30Z' });
          Travis.app.trigger('build:finished', this.data);
        });

        itDoesNotUpdateTheBuildsHistoryTableRow();
      });
    });
  });
});
