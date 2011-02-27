var itAddsTheRepositoryToTheRepositoriesCollection = function() {
  it('adds the repository to the repositories collection', function() {
    runs(function() {
      expect(Travis.app.repositories.last().get('name')).toEqual('svenfuchs/gem-release');
    });
  });
};

var itMovesTheRepositoryToTheTopOfTheRepositoriesList = function() {
  it('prepends the repository to the repositories list', function() {
    runsWhen(repositoriesListPopulated, function() {
      expectText('#repositories .repository:nth-of-type(1) a:nth-of-type(1)', this.data.repository.name)
    });
  });
};

var itUpdatesTheRepositoryListItemsBuildInformation = function() {
  it('updates the build number of the repository list item', function() {
    runs(function() {
      expectText('#repositories #repository_' + this.data.repository.id + ' .build', '#' + this.data.repository.last_build.number);
    });
  });
}

var itAddsTheBuildToTheRepositorysBuildsCollection = function() {
  it("it adds the build to the repository's builds collection", function() {
    runs(function() {
      expect(Travis.app.repositories.last().builds.models.length).toEqual(2);
    });
  });
};

var itSetsTheRepositoryListItemsBuildStatusColor = function() {
  it('updates the build status color of the repository list item', function() {
    runs(function() {
      var selector = '#repositories #repository_' + this.data.repository.id + '.';
      expectElement(selector + 'red,' + selector + 'green');
    });
  });
};

var itResetsTheRepositoryListItemsBuildStatusColor = function() {
  it('updates the build status color of the repository list item', function() {
    runs(function() {
      var selector = '#repositories #repository_' + this.data.repository.id + '.';
      expectNoElement(selector + 'red,' + selector + 'green');
    });
  });
};

var itIndicatesTheRepositoryIsBeingBuilt = function() {
  it('it indicates the repository is being built', function() {
    runs(function() {
      expectElement('#repositories #repository_' + this.data.repository.id + '.active');
    });
  });
};

var itDoesNotIndicateTheRepositoryIsBeingBuilt = function() {
  it('it does not indicate the repository is being built', function() {
    runs(function() {
      expectNoElement('#repositories #repository_' + this.data.repository.id + '.active');
    });
  });
};

var itUpdatesTheBuildSummary = function(selector) {
  it('updates the build number of the repository build summary', function() {
    runs(function() {
      expectText(selector + ' .summary .number', this.data.repository.last_build.number + '');
    });
  });
};

var itDoesNotUpdateTheBuildSummary = function(selector) {
  it('does not update the build number of the repository build summary', function() {
    runs(function() {
      expectText(selector + ' .summary .number', INIT_DATA.repositories[1].last_build.number + '');
    });
  });
};

var itAppendsToTheBuildLog = function(selector) {
  it('appends to the build log', function() {
    runs(function() {
      expectText(selector + ' .log', this.repository.last_build.log + this.data.append_log)
    });
  });
};

var itDoesNotAppendToTheBuildLog = function(selector) {
  it('does not append to the build log', function() {
    runs(function() {
      expectText(selector + ' .log', INIT_DATA.repositories[1].last_build.log)
    });
  });
};

var itPrependsTheBuildToTheBuildsHistoryTable = function() {
  it('prepends the build to the builds history table', function() {
    runs(function() {
      expectText('#main #builds tbody tr:first-child td.number', '#' + this.data.number)
    });
  });
};

var itDoesNotPrependTheBuildToTheBuildsHistoryTable = function() {
  it('does not prepend the build to the builds history table', function() {
    runs(function() {
      expectText('#main #builds tbody tr:first-child td.number', '#' + this.repository.last_build.number)
    });
  });
}

var itUpdatesTheBuildsHistoryTableRow = function() {
  it('updates the builds history table row', function() {
    runs(function() {
      expectAttributeValue('#main #builds tbody tr:first-child td.finishedAt', 'title', this.data.finishedAt)
    });
  });
};

var itDoesNotUpdateTheBuildsHistoryTableRow = function() {
  it('does not update the builds history table row', function() {
    runs(function() {
      expectAttributeValue('#main #builds tbody tr:first-child td.finishedAt', 'title', this.repository.last_build.finishedAt)
    });
  });
};
