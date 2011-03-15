var MATRIX = [
  ['Build', 'Gemfile',                  'Rvm'   ], // FIXME  'Finished', 'Duration'
  ['3.1',   'test/Gemfile.rails-2.3.x', '1.8.7' ],
  ['3.2',   'test/Gemfile.rails-3.0.x', '1.8.7' ],
  ['3.3',   'test/Gemfile.rails-2.3.x', '1.9.2' ],
  ['3.4',   'test/Gemfile.rails-3.0.x', '1.9.2' ],
];

var HISTORY = {
  'svenfuchs/minimal': [
    ['Build', 'Commit',  'Message',              ], // FIXME  'Duration', 'Finished'
    ['3',     'add057e', 'unignore Gemfile.lock' ], //        '20 sec',   /\d+ months ago/
    ['2',     '91d1b7b', 'Bump to 0.0.22'        ],
    ['1',     '1a738d9', 'add Gemfile'           ]
  ],
  'josevalim/enginex': [
    ['Build', 'Commit',  'Message',              ], // FIXME  'Duration', 'Finished'
    ['1',     '565294c', 'Update Capybara'       ], //        '20 sec',   /\d+ months ago/
  ]
};

var expectRepositoryView = function(options) {
  waitsFor(repositoriesFetched());
  waitsFor(tabRendered(options.tab));

  var repositories, repository, position;

  runs(function() {
    repositories = Travis.app.repositories;
    repository = repositories.getBy({ name: options.name });
    position = repositories.length - repositories.models.indexOf(repository);

    expect('#left #repositories li:nth-child(1)').toListRepository({ name: 'svenfuchs/minimal', build: 3, selected: position == 1 });
    expect('#left #repositories li:nth-child(2)').toListRepository({ name: 'josevalim/enginex', build: 1, color: 'red', selected: position == 2 });
  });

  waitsFor(function() { return repository.builds.fetched; });

  runs(function() {
    var build = repository.builds.get(options.build);

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
  })
}

describe('Integration: browsing', function() {
  beforeEach(function() {
    startApp();
  });

  afterEach(function() {
    stopApp();
  });

  it('visiting the homepage', function() {
    goTo('/');
    expectRepositoryView({ name: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });
  });

  it('visiting the current build tab for repository with a matrix build', function() {
    goTo('svenfuchs/minimal');
    expectRepositoryView({ name: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });
  });

  it('visiting the current build tab for repository with a normal build', function() {
    goTo('josevalim/enginex');
    expectRepositoryView({ name: 'josevalim/enginex', build: 8, tab: 'current', log: 'enginex build 1 log ...' })
  });

  it('visiting the build history tab', function() {
    goTo('svenfuchs/minimal/builds');
    expectRepositoryView({ name: 'svenfuchs/minimal', tab: 'history',history: HISTORY['svenfuchs/minimal'] });
  });

  it('visiting the build tab for repository with a matrix build', function() {
    goTo('svenfuchs/minimal/builds/3');
    expectRepositoryView({ name: 'svenfuchs/minimal', build: 3, tab: 'build', matrix: MATRIX });
  });

  it('visiting the build tab for repository with a normal build', function() {
    goTo('josevalim/enginex/builds/8');
    expectRepositoryView({ name: 'josevalim/enginex', build: 8, tab: 'build', log: 'enginex build 1 log ...' });
  });

  it('visiting the homepage and selecting another repository', function() {
    goTo('/');
    expectRepositoryView({ name: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });

    follow('josevalim/enginex');
    expectRepositoryView({ name: 'josevalim/enginex', build: 8, tab: 'current', log: 'enginex build 1 log ...' });
  });

  it('visiting the homepage, selecting the build history tab and viewing a build, do the same for another repository and then for the first one again (this time w/ everything preloaded)', function() {
    goTo('/');
    waitsFor(repositoriesListPopulated());

    _.times(2, function() {
      follow('svenfuchs/minimal');
      expectRepositoryView({ name: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });

      follow('Build History');
      expectRepositoryView({ name: 'svenfuchs/minimal', tab: 'history', history: HISTORY['svenfuchs/minimal'] });

      follow('2', '#builds');
      expectRepositoryView({ name: 'svenfuchs/minimal', build: 2, tab: 'build', log: 'minimal build 2 log ...' });

      follow('josevalim/enginex');
      expectRepositoryView({ name: 'josevalim/enginex', build: 8, tab: 'current', log: 'enginex build 1 log ...' });

      follow('Build History');
      expectRepositoryView({ name: 'josevalim/enginex', tab: 'history', history: HISTORY['josevalim/enginex'] });

      follow('1', '#builds');
      expectRepositoryView({ name: 'josevalim/enginex', build: 8, tab: 'build', log: 'enginex build 1 log ...' });
    });
  });
});
