describe('Events:', function() {
  describe('on the build view', function() {
    this.delay = 0;

    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      goTo('#!/' + this.repository.name + '/builds/' + this.repository.last_build.id)
      waitsFor(repositoriesListPopulated(1));
      waitsFor(buildTabActive(this.repository.name, 'build'));
    });

    describe('an incoming event for the current build', function() {
      describe('build:log', function() {
        beforeEach(function() {
          this.data = buildLogData(this.repository, { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        itAppendsToTheBuildLog('#tab_build');
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = _.extend(buildFinishedData(this.repository), { finished_at: '2010-11-11T12:01:30Z' });
          Travis.app.trigger('build:finished', this.data);
        });

        itUpdatesTheRepositoryListItemsBuildInformation();
        itSetsTheRepositoryListItemsBuildStatusColor();
        itDoesNotIndicateTheRepositoryIsBeingBuilt();
        itUpdatesTheBuildSummary('#tab_build');
      });
    });

    describe('an incoming event for a different build', function() {
      describe('build:log', function() {
        beforeEach(function() {
          this.data = buildLogData(INIT_DATA.repositories[0], { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        itDoesNotAppendToTheBuildLog('#tab_build');
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = buildFinishedData(INIT_DATA.repositories[0]);
          Travis.app.trigger('build:finished', this.data);
        });

        itUpdatesTheRepositoryListItemsBuildInformation();
        itSetsTheRepositoryListItemsBuildStatusColor();
        itDoesNotIndicateTheRepositoryIsBeingBuilt();
        itDoesNotUpdateTheBuildSummary('#tab_build');
      });
    });
  });
});
