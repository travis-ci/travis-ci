var itAddsTheRepositoryToTheRepositoriesCollection = function() {
  it('adds the repository to the repositories collection', function() {
    runs(function() {
      expect(Travis.app.repositories.last().get('name')).toEqual('svenfuchs/gem-release');
    });
  });
};

var itMovesTheRepositoryToTheTopOfTheRepositoriesList = function(delay) {
  it('prepends the repository to the repositories list', function() {
    runsWhen(repositoriesListPopulated, function() {
      expectText('#repositories .repository:nth-of-type(1) a:nth-of-type(1)', this.data.repository.name)
    });
  });
};

var itUpdatesTheRepositoryListItemsBuildInformation = function(delay) {
  it('updates the build number of the repository list item', function() {
    runsWhen(function() { return true; }, function() {
      expectText('#repositories #repository_' + this.data.repository.id + ' .build', '#' + this.data.repository.last_build.number);
    });
  });
}

var itAddsTheBuildToTheRepositorysBuildsCollection = function(delay) {
  it("it adds the build to the repository's builds collection", function() {
    runs(function() {
      expect(Travis.app.repositories.last().builds.models.length).toEqual(2);
    });
  });
};

var itSetsTheRepositoryListItemsBuildStatusColor = function(delay) {
  it('updates the build status color of the repository list item', function() {
    runsAfter(delay, function() {
      var selector = '#repositories #repository_' + this.data.repository.id + '.';
      expectElement(selector + 'red,' + selector + 'green');
    });
  });
};

var itResetsTheRepositoryListItemsBuildStatusColor = function(delay) {
  it('updates the build status color of the repository list item', function() {
    runsAfter(delay, function() {
      var selector = '#repositories #repository_' + this.data.repository.id + '.';
      expectNoElement(selector + 'red,' + selector + 'green');
    });
  });
};

var itIndicatesTheRepositoryIsBeingBuilt = function(delay) {
  it('it indicates the repository is being built', function() {
    runsAfter(delay, function() {
      expectElement('#repositories #repository_' + this.data.repository.id + '.active');
    });
  });
};

var itDoesNotIndicateTheRepositoryIsBeingBuilt = function(delay) {
  it('it does not indicate the repository is being built', function() {
    runsAfter(delay, function() {
      expectNoElement('#repositories #repository_' + this.data.repository.id + '.active');
    });
  });
};

var itUpdatesTheBuildSummary = function(delay) {
  it('updates the build number of the repository build summary', function() {
    runsAfter(delay, function() {
      expectText('#main .summary .number', this.data.repository.last_build.number + '');
    });
  });
};

var itDoesNotUpdateTheBuildSummary = function(delay) {
  it('does not update the build number of the repository build summary', function() {
    runsAfter(delay, function() {
      expectText('#main .summary .number', INIT_DATA.repositories[1].last_build.number + '');
    });
  });
};

var itAppendsToTheBuildLog = function(delay) {
  it('appends to the build log', function() {
    runsAfter(delay, function() {
      expectText('#main .log', this.repository.last_build.log + this.data.append_log)
    });
  });
};

var itDoesNotAppendToTheBuildLog = function(delay) {
  it('does not append to the build log', function() {
    runsAfter(delay, function() {
      expectText('#main .log', INIT_DATA.repositories[1].last_build.log)
    });
  });
};

var itPrependsTheBuildToTheBuildsHistoryTable = function(delay) {
  it('prepends the build to the builds history table', function() {
    expectText('#main #builds tr:nth-child(2) td.number', '#' + this.data.number)
  });
};

var itDoesNotPrependTheBuildToTheBuildsHistoryTable = function(delay) {
  it('does not prepend the build to the builds history table', function() {
    runsAfter(delay, function() {
      expectText('#main #builds tr:nth-child(2) td.number', '#' + this.repository.last_build.number)
    });
  });
}

var itUpdatesTheBuildsHistoryTableRow = function(delay) {
  it('updates the builds history table row', function() {
    runsAfter(400, function() {
      expectAttributeValue('#main #builds tr:nth-child(2) td.finishedAt', 'title', this.data.finishedAt)
    });
  });
};

var itDoesNotUpdateTheBuildsHistoryTableRow = function(delay) {
  it('does not update the builds history table row', function() {
    runsAfter(400, function() {
      expectAttributeValue('#main #builds tr:nth-child(2) td.finishedAt', 'title', this.repository.last_build.finishedAt)
    });
  });
};
