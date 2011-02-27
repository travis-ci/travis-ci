describe('Events:', function() {
  describe('on the repository view (current build tab)', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
      goTo('#!/' + this.repository.name)
      waitsFor(repositoriesListPopulated(1));
    });

    describe('an incoming event for a new repository', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = newRepositoryData();
          Travis.app.trigger('build:started', this.data);
        });

        itAddsTheRepositoryToTheRepositoriesCollection();
        itMovesTheRepositoryToTheTopOfTheRepositoriesList();
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = newRepositoryData();
          Travis.app.trigger('build:finished', this.data);
        });

        itMovesTheRepositoryToTheTopOfTheRepositoriesList();
      });
    });

    describe('an incoming event for the current repository', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = buildStartedData(this.repository);
          Travis.app.trigger('build:started', this.data)
          this.data.repository.name = this.repository.name;
          waits(700) // hu
        });

        itMovesTheRepositoryToTheTopOfTheRepositoriesList();
        itIndicatesTheRepositoryIsBeingBuilt();
        itAddsTheBuildToTheRepositorysBuildsCollection();
        itUpdatesTheRepositoryListItemsBuildInformation();
        itUpdatesTheBuildSummary('#tab_current');
      });

      describe('build:log', function() {
        beforeEach(function() {
          this.data = buildLogData(this.repository, { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        itAppendsToTheBuildLog('#tab_current');
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = buildFinishedData(this.repository);
          Travis.app.trigger('build:finished', this.data);
        });

        itUpdatesTheRepositoryListItemsBuildInformation();
        itSetsTheRepositoryListItemsBuildStatusColor();
        itDoesNotIndicateTheRepositoryIsBeingBuilt();
        itUpdatesTheBuildSummary('#tab_current');
      });
    });

    describe('an incoming event for a different repository', function() {
      describe('build:started', function() {
        beforeEach(function() {
          this.data = _.extend(buildStartedData(INIT_DATA.repositories[0]), { number: 4 });
          Travis.app.trigger('build:started', this.data);
        });

        itUpdatesTheRepositoryListItemsBuildInformation();
        itIndicatesTheRepositoryIsBeingBuilt();
        itDoesNotUpdateTheBuildSummary('#tab_current');
      });

      describe('build:log', function() {
        beforeEach(function() {
          this.data = buildLogData(INIT_DATA.repositories[0], { append_log: ' foo!'});
          Travis.app.trigger('build:log', this.data);
        });

        itDoesNotAppendToTheBuildLog('#tab_current');
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.data = buildFinishedData(INIT_DATA.repositories[0]);
          Travis.app.trigger('build:finished', this.data);
        });

        itUpdatesTheRepositoryListItemsBuildInformation();
        itSetsTheRepositoryListItemsBuildStatusColor();
        itDoesNotIndicateTheRepositoryIsBeingBuilt();
        itDoesNotUpdateTheBuildSummary('#tab_current');
      });
    });
  });
});

