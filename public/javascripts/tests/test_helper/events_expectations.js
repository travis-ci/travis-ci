var it_adds_the_repository_to_the_repositories_collection = function() {
  it('adds the repository to the repositories collection', function() {
    runs(function() {
      expect(Travis.app.repositories.last().get('name')).toEqual('svenfuchs/gem-release');
    });
  });
};

var it_moves_the_repository_to_the_top_of_the_repositories_list = function(delay) {
  it('prepends the repository to the repositories list', function() {
    runs_when(repositories_list_populated, function() {
      expect_text('#repositories .repository:nth-of-type(1) a:nth-of-type(1)', this.data.repository.name)
    });
  });
};

var it_updates_the_repository_list_items_build_information = function(delay) {
  it('updates the build number of the repository list item', function() {
    runs_when(function() { return true; }, function() {
      expect_text('#repositories #repository_' + this.data.repository.id + ' .build', '#' + this.data.repository.last_build.number);
    });
  });
}

var it_adds_the_build_to_the_repositorys_builds_collection = function(delay) {
  it("it adds the build to the repository's builds collection", function() {
    runs(function() {
      expect(Travis.app.repositories.last().builds.models.length).toEqual(2);
    });
  });
};

var it_sets_the_repository_list_items_build_status_color = function(delay) {
  it('updates the build status color of the repository list item', function() {
    runs_after(delay, function() {
      var selector = '#repositories #repository_' + this.data.repository.id + '.';
      expect_element(selector + 'red,' + selector + 'green');
    });
  });
};

var it_resets_the_repository_list_items_build_status_color = function(delay) {
  it('updates the build status color of the repository list item', function() {
    runs_after(delay, function() {
      var selector = '#repositories #repository_' + this.data.repository.id + '.';
      expect_no_element(selector + 'red,' + selector + 'green');
    });
  });
};

var it_indicates_the_repository_is_being_built = function(delay) {
  it('it indicates the repository is being built', function() {
    runs_after(delay, function() {
      expect_element('#repositories #repository_' + this.data.repository.id + '.active');
    });
  });
};

var it_does_not_indicate_the_repository_is_being_built = function(delay) {
  it('it does not indicate the repository is being built', function() {
    runs_after(delay, function() {
      expect_no_element('#repositories #repository_' + this.data.repository.id + '.active');
    });
  });
};

var it_updates_the_build_summary = function(delay) {
  it('updates the build number of the repository build summary', function() {
    runs_after(delay, function() {
      expect_text('#main .summary .number', this.data.repository.last_build.number + '');
    });
  });
};

var it_does_not_update_the_build_summary = function(delay) {
  it('does not update the build number of the repository build summary', function() {
    runs_after(delay, function() {
      expect_text('#main .summary .number', INIT_DATA.repositories[1].last_build.number + '');
    });
  });
};

var it_appends_to_the_build_log = function(delay) {
  it('appends to the build log', function() {
    runs_after(delay, function() {
      expect_text('#main .log', this.repository.last_build.log + this.data.append_log)
    });
  });
};

var it_does_not_append_to_the_build_log = function(delay) {
  it('does not append to the build log', function() {
    runs_after(delay, function() {
      expect_text('#main .log', INIT_DATA.repositories[1].last_build.log)
    });
  });
};

var it_prepends_the_build_to_the_builds_history_table = function(delay) {
  it('prepends the build to the builds history table', function() {
    runs_after(delay, function() {
      expect_text('#main #builds tr:nth-child(2) td.number', '#' + this.data.number)
    });
  });
};

var it_does_not_prepend_the_build_to_the_builds_history_table = function(delay) {
  it('does not prepend the build to the builds history table', function() {
    runs_after(delay, function() {
      expect_text('#main #builds tr:nth-child(2) td.number', '#' + this.repository.last_build.number)
    });
  });
}

var it_updates_the_builds_history_table_row = function(delay) {
  it('updates the builds history table row', function() {
    runs_after(400, function() {
      expect_attribute_value('#main #builds tr:nth-child(2) td.finished_at', 'title', this.data.finished_at)
    });
  });
};

var it_does_not_update_the_builds_history_table_row = function(delay) {
  it('does not update the builds history table row', function() {
    runs_after(400, function() {
      expect_attribute_value('#main #builds tr:nth-child(2) td.finished_at', 'title', this.repository.last_build.finished_at)
    });
  });
};
