describe('Running a build matrix', function() {
  var PAYLOADS = {
    'build:queued:1':   { repository: { id: 1, slug: 'svenfuchs/minimal' }, build: { id: 3, number: 3,  } },
    'build:started:1':  { repository: { id: 1, slug: 'svenfuchs/minimal' }, build: { id: 3, number: 3, started_at: '2010-11-12T17:00:00Z', commit: '1111111', committer_name: 'Sven Fuchs', message: 'gem-minimal commit' } },
    'build:expanded:1': { repository: { id: 1 }, build: { id: 3, config: { rvm: ['1.8.7', '1.9.2'] }, matrix: [ { id: 4, parent_id: 3, number: '3.1', config: { gemfile: 'test/Gemfile.rails-2.3.x', rvm: '1.8.7' } }, { id: 5, parent_id: 3, number: '3.2', config: { gemfile: 'test/Gemfile.rails-3.0.x', rvm: '1.8.7' } }, { id: 6, parent_id: 3, number: '3.3', config: { gemfile: 'test/Gemfile.rails-2.3.x', rvm: '1.9.2' } }, { id: 7, parent_id: 3, number: '3.4', config: { gemfile: 'test/Gemfile.rails-3.0.x', rvm: '1.9.2' } } ] } },
    'build:log:1':      { repository: { id: 1 }, build: { id: 4, parent_id: 3, _log: 'log chars ... ' } },
    'build:finished:1': { repository: { id: 1 }, build: { id: 4, parent_id: 3, status: 0, finished_at: '2010-11-12T17:00:10Z' } },
  };
  var trigger = function(event, payload, expectations) {
   runs(function() { Travis.trigger(event, payload); });
   waits(50);
   if(expectations) runs(expectations);
  };

  var expect_matrix_table_on = function(selector) {
    expect(selector + ' #matrix').toMatchTable([
      ['Build', 'Gemfile', 'Rvm'  ],
      ['3.1',   'test/Gemfile.rails-2.3.x', '1.8.7'],
      ['3.2',   'test/Gemfile.rails-3.0.x', '1.8.7'],
    ]);
  };


  beforeEach(function() {
    startApp();
    goTo('/');
    waitsFor(repositoriesListPopulated());
  });

  afterEach(function() {
    stopApp();
  });

  it('schedules the build job, expands the matrix and runs each build', function() {
    trigger('build:queued', PAYLOADS['build:queued:1'], function() {
      // expect job list to contain job
      expectText('#jobs li:nth-child(3)', 'svenfuchs/minimal #3');
    });

    trigger('build:started', PAYLOADS['build:started:1'], function() {
      expect($('#jobs').html()).not.toHaveText(/svenfuchs\/minimal #3/);
      // expect repository list to contain the repo
      expect('#repositories li:nth-child(1)').toListRepository({ slug: 'svenfuchs/minimal', build: 3, selected: true, color: undefined, finished_at: '-', duration: '4 hrs 30 sec' });
      // expect the current tab to show the build
      expect($('#tab_current')).toShowBuildSummary({ build: 3, commit: '1111111 (master)', committer: 'Sven Fuchs', finished_at: '-', duration: '30 sec' });
    });

    trigger('build:expanded', PAYLOADS['build:expanded:1'], function() {
      // expect the current tab to show the build matrix
      expect_matrix_table_on('#tab_current');
    });

    goTo('svenfuchs/minimal');
    runsAfter(10, function() {
      // expect the build tab to be active and show the parent build #3
      expect($('#tab_current.active h5')).toHaveText('Current');
      // expect the build child tab to show the build details
      expect($('#tab_current.active .summary')).not.toBeEmpty();
      // expect the current tab to show the build matrix
      expect_matrix_table_on('#tab_current');
    });

    trigger('build:log', PAYLOADS['build:log:1'], function() {
      // expect the build child tab to be active
      expect($('#tab_current.active h5')).toHaveText('Current');
      // expect the build child tab to show the details
      expect($('#tab_current.active .summary')).not.toBeEmpty();
      // expect the current tab to show the build matrix
      expect_matrix_table_on('#tab_current');
    });

    goTo('svenfuchs/minimal/builds/3');
    runsAfter(10, function() {
      // expect the build tab to be active and show the parent build #3
      expect($('#tab_build.active h5')).toHaveText('Build 3');
      // expect the build child tab to show the build details
      expect($('#tab_build.active .summary')).not.toBeEmpty();
      // expect the current tab to show the build matrix
      expect_matrix_table_on('#tab_build');
    });

    trigger('build:log', PAYLOADS['build:log:1'], function() {
      // expect the build child tab to be active
      expect($('#tab_build.active h5')).toHaveText('Build 3');
      // expect the build child tab to show the details
      expect($('#tab_build.active .summary')).not.toBeEmpty();
      // expect the current tab to show the build matrix
      expect_matrix_table_on('#tab_build');
    });

    goTo('svenfuchs/minimal/builds/4');
    runsAfter(10, function() {
      // expect the build child tab to be active and show the child build #3.1
      expect($('#tab_build.active h5')).toHaveText('Build 3.1');
      // expect the build child tab to show the build details
      expect($('#tab_build.active .summary')).not.toBeEmpty();
      // expect the build child tab to show the updated log
      expect($('#tab_build.active .log')).toHaveText('log chars ... log chars ...');
    });

    trigger('build:log', PAYLOADS['build:log:1'], function() {
      // expect the build child tab to be active
      expect($('#tab_build.active h5')).toHaveText('Build 3.1');
      // expect the build child tab to show the details
      expect($('#tab_build.active .summary')).not.toBeEmpty();
      // expect the build child tab to show the updated log
      expect($('#tab_build.active .log')).toHaveText('log chars ... log chars ... log chars ...');
    });

    trigger('build:finished', PAYLOADS['build:finished:1'], function() {
      // expect the build child tab to be active
      expect($('#tab_build.active h5')).toHaveText('Build 3.1');
      // expect the build log to show the log
      expect($('#tab_build.active .log')).toHaveText('log chars ... log chars ... log chars ...');
      // expect the build to be finished
      expect($('#tab_build .finished_at').attr('title')).toBe('2010-11-12T17:00:10Z')
    });
  });

  it('does not add the matrix parent build to the matrix collection', function() {
    trigger('build:started', PAYLOADS['build:started:1']);
    trigger('build:expanded', PAYLOADS['build:expanded:1']);

    goTo('svenfuchs/minimal/builds/4');
    waits(10)
    goTo('svenfuchs/minimal/builds/3');

    runsAfter(10, function() {
      expect_matrix_table_on('#tab_build');
    });
  });
});
