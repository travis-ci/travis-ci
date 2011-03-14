var MATRIX = [
  ['Build', 'Gemfile',                  'Rvm'   ], // FIXME  'Finished', 'Duration'
  ['3.1',   'test/Gemfile.rails-2.3.x', '1.8.7' ],
  ['3.2',   'test/Gemfile.rails-3.0.x', '1.8.7' ],
  ['3.3',   'test/Gemfile.rails-2.3.x', '1.9.2' ],
  ['3.4',   'test/Gemfile.rails-3.0.x', '1.9.2' ],
];

var HISTORY = [
  ['Build', 'Commit',  'Message',              ], // FIXME  'Duration', 'Finished'
  ['3',     'add057e', 'unignore Gemfile.lock' ], //        '20 sec',   /\d+ months ago/
  ['2',     '91d1b7b', 'Bump to 0.0.22'        ],
  ['1',     '1a738d9', 'add Gemfile'           ]
];

describe('Integration: browsing', function() {
  beforeEach(function() {
    serveFixtures();
    startApp();
  });

  afterEach(function() {
    stopApp();
  });

  it('visiting the homepage', function() {
    goTo('/');
    waitsFor(repositoriesFetched());
    expectRepositoryList({ selected: 1 });

    waitsFor(tabRendered('current'));
    expectRepositoryShow({ repository: 1, build: 3, tab: 'current', matrix: MATRIX});
  });

  it('visiting the current build tab for repository with a matrix build', function() {
    goTo('svenfuchs/minimal');
    waitsFor(repositoriesFetched());
    expectRepositoryList({ selected: 1 });

    waitsFor(tabRendered('current'));
    expectRepositoryShow({ repository: 1, build: 3, tab: 'current', matrix: MATRIX});
  });

  it('visiting the current build tab for repository with a normal build', function() {
    goTo('josevalim/enginex');
    waitsFor(repositoriesFetched());
    expectRepositoryList({ selected: 2 });

    waitsFor(tabRendered('current'));
    expectRepositoryShow({ repository: 2, build: 8, tab: 'current', log: 'enginex build 1 log ...'});
  });

  it('visiting the build history tab', function() {
    goTo('svenfuchs/minimal/builds');
    waitsFor(repositoriesFetched());
    expectRepositoryList({ selected: 1 });

    waitsFor(tabRendered('history'));
    expectRepositoryShow({ repository: 1, build: 3, tab: 'history', history: HISTORY});
  });

  it('visiting the current build tab for repository with a normal build', function() {
    goTo('josevalim/enginex/builds/8');
    waitsFor(repositoriesFetched());
    expectRepositoryList({ selected: 2 });

    waitsFor(tabRendered('current'));
    expectRepositoryShow({ repository: 2, build: 8, tab: 'build', log: 'enginex build 1 log ...'});
  });
});

var expectRepositoryList = function(options) {
  runs(function() {
    expect('#left #repositories li:nth-child(1)').toListRepository({ name: 'svenfuchs/minimal', build: 3, selected: options.selected == 1 });
    expect('#left #repositories li:nth-child(2)').toListRepository({ name: 'josevalim/enginex', build: 1, color: 'red', selected: options.selected == 2 });
  });
};

var expectRepositoryShow = function(options) {
  runs(function() {
    Travis.app.repositories.whenFetched(function(repositories) {
      var repository = repositories.get(options.repository);
      repository.builds().whenFetched(function(builds) {
        var build = builds.get(options.build);

        expect('#main .repository h3').toHaveText(repository.get('name'));
        expect('#main .repository').toShowActiveTab(options.tab);

        if(options.tab == 'current' || options.tab == 'build') {
          expect('#tab_' + options.tab).toShowBuildSummary({ build: build.get('number'), commit: build.commit(), committer: build.get('committer_name') });
        }

        if(options.log != undefined) {
          expect('#tab_' + options.tab).toShowBuildLog(options.log);
        } else if(options.matrix) {
          expect('#tab_' + options.tab + ' #matrix').toMatchTable(options.matrix);
        } else if(options.history) {
          expect('#tab_history #builds').toMatchTable(options.history);
        }
      });
    })
  });
}


