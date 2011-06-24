var MATRIX = [
  ['Build', 'Gemfile',                  'Rvm',   'Finished', 'Duration'     ],
  ['3.1',   'test/Gemfile.rails-2.3.x', '1.8.7', '-',        '4 hrs 30 sec' ],
  ['3.2',   'test/Gemfile.rails-3.0.x', '1.8.7', '-',        '4 hrs 30 sec' ],
  ['3.3',   'test/Gemfile.rails-2.3.x', '1.9.2', '-',        '4 hrs 30 sec' ],
  ['3.4',   'test/Gemfile.rails-3.0.x', '1.9.2', '-',        '4 hrs 30 sec' ],
];

var HISTORY = {
  'svenfuchs/minimal': [
    ['Build', 'Commit',           'Message',              'Duration',        'Finished'          ],
    ['3',     'add057e (master)', 'unignore Gemfile.lock', '4 hrs 30 sec',   '-'                 ],
    ['2',     '91d1b7b (master)', 'Bump to 0.0.22',        '8 sec',          'about 5 hours ago' ],
    ['1',     '1a738d9 (master)', 'add Gemfile',           '8 sec',          'about 5 hours ago' ]
  ],
  'josevalim/enginex': [
    ['Build', 'Commit',  'Message',         'Duration', 'Finished' ],
    ['1',     '565294c', 'Update Capybara', '20 sec',  'a day ago' ],
  ]
};

var expectRepositoryView = function(options) {
  waitsFor(repositoriesFetched());
  waitsFor(tabRendered(options.tab));

  var repositories, repository, position;

  runs(function() {
    repositories = Travis.app.repositories;
    repository = repositories.getBy({ slug: options.slug });
    position = repositories.length - repositories.models.indexOf(repository);

    expect('#left #repositories li:nth-child(1)').toListRepository({ slug: 'svenfuchs/minimal', build: 3, color: null,  selected: position == 1, finished_at: '-', duration: '4 hrs 30 sec' });
    expect('#left #repositories li:nth-child(2)').toListRepository({ slug: 'josevalim/enginex', build: 1, color: 'red', selected: position == 2, finished_at: 'a day ago', duration: '20 sec' });

    expect('#main .repository h3').toHaveText(repository.get('slug'));
    expect('#main .repository').toShowActiveTab(options.tab);

    if(options.tab == 'current' || options.tab == 'build') {
      var build;
      waitsFor(function() { build = repository.builds.get(options.build); return build; });

      runs(function() {
        expect('#tab_' + options.tab).toShowBuildSummary({
          build: build.get('number'),
          commit: build.commit() + (build.get('branch') ? ' (' + build.get('branch') + ')' : ''),
          committer: build.get('committer_name'),
          finished_at: build.get('finished_at') ? $.timeago.distanceInWords(new Date(build.get('finished_at'))) : '-',
          duration: Utils.readableTime(build.duration())
        });

        if(options.log != undefined) {
          expect('#tab_' + options.tab).toShowBuildLog(options.log);
        } else if(options.matrix) {
          expect('#tab_' + options.tab + ' #matrix').toMatchTable(options.matrix);
        }
      });
    } else if(options.history) {
      waitsFor(function() { return repository.builds.fetched });
      runs(function() {
        expect('#tab_history #builds').toMatchTable(options.history);
      });
    }
  });
}

describe('Pages:', function() {
  beforeEach(function() {
    startApp();
  });

  afterEach(function() {
    stopApp();
  });

  it('visiting the homepage', function() {
    goTo('/');
    expectRepositoryView({ slug: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });
  });

  it('visiting the current build tab for repository with a matrix build', function() {
    goTo('svenfuchs/minimal');
    expectRepositoryView({ slug: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });
  });

  it('visiting the current build tab for repository with a normal build', function() {
    goTo('josevalim/enginex');
    expectRepositoryView({ slug: 'josevalim/enginex', build: 8, tab: 'current', log: 'enginex build 1 log ...' })
  });

  it('visiting the build history tab', function() {
    goTo('svenfuchs/minimal/builds');
    expectRepositoryView({ slug: 'svenfuchs/minimal', tab: 'history',history: HISTORY['svenfuchs/minimal'] });
  });

  it('visiting the build tab for repository with a matrix build', function() {
    goTo('svenfuchs/minimal/builds/3');
    expectRepositoryView({ slug: 'svenfuchs/minimal', build: 3, tab: 'build', matrix: MATRIX });
  });

  it('visiting the build tab for repository with a normal build', function() {
    goTo('josevalim/enginex/builds/8');
    expectRepositoryView({ slug: 'josevalim/enginex', build: 8, tab: 'build', log: 'enginex build 1 log ...' });
  });

  it('visiting the homepage and selecting another repository', function() {
    goTo('/');
    expectRepositoryView({ slug: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });

    follow('josevalim/enginex');
    expectRepositoryView({ slug: 'josevalim/enginex', build: 8, tab: 'current', log: 'enginex build 1 log ...' });
  });

  it('visiting the homepage, selecting the build history tab and viewing a build, do the same for another repository and then for the first one again (this time w/ everything preloaded)', function() {
    goTo('/');
    waitsFor(repositoriesListPopulated());

    _.times(1, function() {
      follow('svenfuchs/minimal');
      waits(100)
      expectRepositoryView({ slug: 'svenfuchs/minimal', build: 3, tab: 'current', matrix: MATRIX });
      waits(100)

      follow('Build History');
      waits(100)
      expectRepositoryView({ slug: 'svenfuchs/minimal', tab: 'history', history: HISTORY['svenfuchs/minimal'] });
      waits(100)

      follow('2', '#builds');
      waits(100)
      expectRepositoryView({ slug: 'svenfuchs/minimal', build: 2, tab: 'build', log: 'minimal build 2 log ...' });
      waits(100)

      follow('josevalim/enginex');
      waits(100)
      expectRepositoryView({ slug: 'josevalim/enginex', build: 8, tab: 'current', log: 'enginex build 1 log ...' });
      waits(100)

      follow('Build History');
      waits(100)
      expectRepositoryView({ slug: 'josevalim/enginex', tab: 'history', history: HISTORY['josevalim/enginex'] });
      waits(100)

      follow('1', '#builds');
      waits(100)
      expectRepositoryView({ slug: 'josevalim/enginex', build: 8, tab: 'build', log: 'enginex build 1 log ...' });
      waits(100)
    });
  });
});
