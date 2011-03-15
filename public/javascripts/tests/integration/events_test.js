var EVENT_PAYLOADS = {
  'build:queued':     { build: { id: 10, number: 4, repository: { id: 1, name: 'svenfuchs/minimal'   } } },
  'build:started:1':  { build: { id: 10, number: 2, repository: { id: 2, name: 'josevalim/enginex'   }, commit: '1111111', committer_name: 'Jose Valim', message: 'enginex commit', log: 'the enginex build 2 log ... ' } },
  'build:started:2':  { build: { id: 11, number: 1, repository: { id: 3, name: 'travis-ci/travis-ci' }, commit: '2222222', committer_name: 'Sven Fuchs', message: 'minimal commit', log: 'the travis-ci build 1 log ... ' } },
  'build:log:1':      { build: { id: 10, repository: { id: 2 } }, log: 'with appended chars' },
  'build:finished:1': { build: { id: 10, status: 0, repository: { id: 2 } } },
  'build:finished:2': { build: { id: 3,  status: 0, repository: { id: 1 } } },
  'build:finished:3': { build: { id: 4,  status: 0, repository: { id: 1 } } },
}

describe('Events:', function() {
  beforeEach(function() {
    startApp();
  });

  afterEach(function() {
    stopApp();
  });

  var trigger = function(event, payload) {
   runs(function() { Travis.trigger(event, payload); })
  }

  describe('build:queued', function() {
    beforeEach(function() {
      goTo('/');
      waitsFor(repositoriesListPopulated());
      trigger('build:queued', EVENT_PAYLOADS['build:queued']);
    });

    it('prepends to the jobs list view', function() {
      expectText('#jobs li:nth-child(3)', 'svenfuchs/minimal #4');
    });
  });

  describe('on the "current" build tab', function() {
    describe('build:started for an existing repository', function() {
      beforeEach(function() {
        goTo('/');
        waitsFor(repositoriesFetched());
        runs(function() { Travis.app.repositories.get(2).builds().fetch(); }); // required so we can assert the new build was added, because the fixtures don't contain it

        trigger('build:queued', EVENT_PAYLOADS['build:queued']);
        trigger('build:started', EVENT_PAYLOADS['build:started:1']);
      });

      it('removes the job from the jobs list view', function() {
        expect($('#jobs li.job_10').length).toBe(0);
      });

      it('updates the repository list entry and moves it to the top of the list', function() {
        expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, selected: true, color: undefined });
      });

      it('adds the build to the repository builds collection', function() {
        var repository = Travis.app.repositories.get(2);
        var build = repository.builds().get(10);
        expect(build.get('number')).toEqual(2);
      });

      it('updates the build summary of the "current" build tab', function() {
        expect($('#tab_current')).toShowBuildSummary({ build: 2, commit: '1111111', committer: 'Jose Valim' });
      });
    });

    describe('build:started for a new repository', function() {
      beforeEach(function() {
        goTo('/');
        waitsFor(repositoriesListPopulated());
        trigger('build:started', EVENT_PAYLOADS['build:started:2']);
      });

      it('adds the new repository at the top of the list', function() {
        expect('#repositories li:nth-child(1)').toListRepository({ name: 'travis-ci/travis-ci', build: 1, selected: true, color: undefined });
      });

      it('adds the repository to the repositories collection and adds build to its builds collection', function() {
        var repository = Travis.app.repositories.get(3);
        var build = repository.builds().get(11);
        expect(repository.get('name')).toEqual('travis-ci/travis-ci')
        expect(build.get('number')).toEqual(1);
      });

      it('updates the build summary of the "current" build tab', function() {
        expect($('#tab_current')).toShowBuildSummary({ build: 1, commit: '2222222', committer: 'Sven Fuchs' });
      });
    });

    describe('build:log for the same repository', function() {
      beforeEach(function() {
        goTo('josevalim/enginex');
        waitsFor(repositoriesFetched());
        trigger('build:started', EVENT_PAYLOADS['build:started:1']);
        trigger('build:log', EVENT_PAYLOADS['build:log:1']);
      });

      it('appends the logged chars to the build log', function() {
        expectText('#tab_current .log', 'the enginex build 2 log ... with appended chars');
      })
    });

    describe('build:log for a different repository', function() {
      beforeEach(function() {
        goTo('/');
        waitsFor(repositoriesFetched());
        trigger('build:started', EVENT_PAYLOADS['build:started:2']);
        trigger('build:log', EVENT_PAYLOADS['build:log:1']);
      });

      it('does not append the logged chars to the build log', function() {
        expectText('#tab_current .log', 'the travis-ci build 1 log ...');
      })
    });

    describe('build:finished for a normal build', function() {
      beforeEach(function() {
        goTo('/');
        waitsFor(repositoriesFetched());
        trigger('build:started', EVENT_PAYLOADS['build:started:1']);
        trigger('build:finished', EVENT_PAYLOADS['build:finished:1']);
      });

      it('updates the repository list item', function() {
        expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, selected: true, color: 'green' }); // FIXME duration, finished_at
      });

      it('updates the build summary', function() {
        expect($('#tab_build')).toShowBuildSummary({ build: 2, commit: '1111111', committer: 'Jose Valim', color: 'green' }); // FIXME  'Duration', 'Finished'
      })
    });

    describe('build:finished for a matrix build', function() {
      beforeEach(function() {
        goTo('/');
        waitsFor(repositoriesFetched());
        trigger('build:finished', EVENT_PAYLOADS['build:finished:2']);
      });

      it('updates the repository list item', function() {
        expect('#repositories li:nth-child(1)').toListRepository({ name: 'svenfuchs/minimal', build: 3, selected: true, color: 'green' }); // FIXME duration, finished_at
      });

      it('updates the build summary', function() {
        expect($('#tab_build')).toShowBuildSummary({ build: 3, commit: 'add057e', committer: 'Sven Fuchs', color: 'green' }); // FIXME  'Duration', 'Finished'
      })
    });
  });

  describe('on the "build history" tab of the same repository', function() {
    beforeEach(function() {
      goTo('josevalim/enginex/builds');
      waitsFor(repositoriesListPopulated());
      trigger('build:started', EVENT_PAYLOADS['build:started:1']);
    });

    describe('build:started', function() {
      it('adds the build to the history', function() {
        expect('#tab_history #builds').toMatchTable([
          ['Build', 'Commit',  'Message'         ], // FIXME  'Duration', 'Finished'
          ['2',     '1111111', 'enginex commit'  ],
          ['1',     '565294c', 'Update Capybara' ],
        ]);
      });
    });

    describe('build:finished', function() {
      beforeEach(function() {
        trigger('build:finished', EVENT_PAYLOADS['build:finished:1']);
      });

      it('updates the repository list item', function() {
        expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, selected: true, color: 'green' }); // FIXME duration, finished_at
      });

      it('adds the build to the history', function() {
        expect($('#tab_history #builds tbody tr:first-child').hasClass('green')).toBeTruthy();
        expect('#tab_history #builds').toMatchTable([
          ['Build', 'Commit',  'Message'         ], // FIXME  'Duration', 'Finished'
          ['2',     '1111111', 'enginex commit'  ],
        ]);
      });
    });
  });

  describe('on the "build history" tab of a different repository', function() {
    beforeEach(function() {
      goTo('svenfuchs/minimal/builds');
      waitsFor(repositoriesListPopulated());
      trigger('build:started', EVENT_PAYLOADS['build:started:1']);
    });

    describe('build:started', function() {
      it('does not add the build to the history', function() {
        expect('#tab_history #builds').toMatchTable([
          ['Build', 'Commit',  'Message'               ], // FIXME  'Duration', 'Finished'
          ['3',     'add057e', 'unignore Gemfile.lock' ],
        ]);
      });
    });

    describe('build:finished', function() {
      beforeEach(function() {
        this.wasHtml = $('#tab_history #builds').html();
        trigger('build:finished', EVENT_PAYLOADS['build:finished:1']);
      });

      it('updates the repository list item', function() {
        expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, color: 'green' }); // FIXME duration, finished_at
      });

      it('does not touch the build history table', function() {
        expect($('#tab_history #builds').html()).toEqual(this.wasHtml);
      });
    });
  });

  describe('on the "build" tab of any repository', function() {
    beforeEach(function() {
      goTo('josevalim/enginex/builds/1');
      waitsFor(repositoriesListPopulated());
      trigger('build:started', EVENT_PAYLOADS['build:started:1']);
    });

    it('build:started does not touch the tab', function() {
      expect($('#tab_build.active')).toShowBuildSummary({ build: 1, commit: '565294c', committer: 'Jose Valim' }); // FIXME  'Duration', 'Finished'
    });
  });

  describe('on the "build" tab', function() {
    describe('for the same repository and (normal) build', function() {
      beforeEach(function() {
        goTo('/');
        waitsFor(repositoriesFetched());
        trigger('build:started', EVENT_PAYLOADS['build:started:1']);
        goTo('/josevalim/enginex/builds/10');
      });

      describe('build:log', function() {
        beforeEach(function() {
          trigger('build:log', EVENT_PAYLOADS['build:log:1']);
        });

        it('appends the logged chars to the build log', function() {
          expectText('#tab_build .log', 'the enginex build 2 log ... with appended chars');
        })
      });

      describe('build:finished', function() {
        beforeEach(function() {
          trigger('build:finished', EVENT_PAYLOADS['build:finished:1']);
        });

        it('updates the repository list item', function() {
          expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, selected: true, color: 'green' }); // FIXME duration, finished_at
        });

        it('updates the build summary', function() {
          expect($('#tab_build')).toShowBuildSummary({ build: 2, commit: '1111111', committer: 'Jose Valim', color: 'green' }); // FIXME  'Duration', 'Finished'
        })
      });
    });

    describe('for the same repository and (matrix) build', function() {
      beforeEach(function() {
        goTo('/svenfuchs/minimal/builds/3');
        waitsFor(repositoriesFetched());
      });

      describe('build:finished for the matrix build', function() {
        beforeEach(function() {
          trigger('build:finished', EVENT_PAYLOADS['build:finished:2']);
        });

        it('updates the build summary', function() {
          expect($('#tab_build')).toShowBuildSummary({ build: 3, commit: 'add057e', committer: 'Sven Fuchs', color: 'green' }); // FIXME  'Duration', 'Finished'
        })
      });

      describe('build:finished for a matrix child build', function() {
        beforeEach(function() {
          trigger('build:finished', EVENT_PAYLOADS['build:finished:3']);
        });

        // FIXME this fails because instead of updating the (nested) child build's status, it adds the child build to the builds collection
        xit('updates the matrix table row', function() {
          expect('#tab_build #matrix').toMatchTable([
            ['Build', 'Gemfile',                  'Rvm'   ], // FIXME  'Finished', 'Duration'
            ['3.1',   'test/Gemfile.rails-2.3.x', '1.8.7' ],
          ]);
          expect($('#tab_build #matrix tbody tr:first-child').hasClass('green')).toBeTruthy();
        })
      });
    });

    describe('for a different build', function() {
      beforeEach(function() {
        goTo('/josevalim/enginex/builds/8');
        waitsFor(repositoriesFetched());
        trigger('build:started', EVENT_PAYLOADS['build:started:1']);
      });

      describe('build:log', function() {
        beforeEach(function() {
          trigger('build:log', EVENT_PAYLOADS['build:log:1']);
        });

        it('does not append the logged chars to the build log', function() {
          expectText('#tab_build .log', 'enginex build 1 log ...');
        })
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.wasHtml = $('#tab_build .summary').html();
          trigger('build:finished', EVENT_PAYLOADS['build:finished:1']);
        });

        it('updates the repository list item', function() {
          expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, selected: true, color: 'green' }); // FIXME duration, finished_at
        });

        it('does not touch the build summary', function() {
          expect($('#tab_build .summary').html()).toEqual(this.wasHtml);
          expect($('#tab_build')).toShowBuildSummary({ build: 1, commit: '565294c', committer: 'Jose Valim' });
        })
      });
    });

    describe('for a different repository and build', function() {
      beforeEach(function() {
        goTo('/svenfuchs/minimal/builds/2');
        waitsFor(repositoriesFetched());
        trigger('build:started', EVENT_PAYLOADS['build:started:1']);
      });

      describe('build:log', function() {
        beforeEach(function() {
          trigger('build:log', EVENT_PAYLOADS['build:log:1']);
        });

        it('does not append the logged chars to the build log', function() {
          expectText('#tab_build .log', 'minimal build 2 log ...');
        })
      });

      describe('build:finished', function() {
        beforeEach(function() {
          this.wasHtml = $('#tab_build .summary').html();
          trigger('build:finished', EVENT_PAYLOADS['build:finished:1']);
        });

        it('updates the repository list item', function() {
          expect('#repositories li:nth-child(1)').toListRepository({ name: 'josevalim/enginex', build: 2, color: 'green' }); // FIXME duration, finished_at
        });

        it('does not touch the build summary', function() {
          expect($('#tab_build .summary').html()).toEqual(this.wasHtml);
          expect($('#tab_build')).toShowBuildSummary({ build: 2, commit: '91d1b7b', committer: 'Sven Fuchs' });
        })
      });
    });
  });
});
