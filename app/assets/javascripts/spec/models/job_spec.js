describe('Job', function() {
  describe('class methods', function() {
    describe('byRepositoryId', function() {
      it('requests GET /repositories.json', function() {
        Travis.Build.byRepositoryId(1);
        expect(mostRecentAjaxRequest().url).toEqual('/repositories/1/builds.json?bare=true');
      });
    });

    describe('createOrUpdate', function() {
      it('calls createOrUpdate for each of the matrix builds, too', function() {
        var build = Travis.Build.createOrUpdate({ id: 99, number: '1', matrix: [{ id: 2, number: '1.1' }]});
        build = Travis.Build.find(build.get('id'));

        expect(build.get('number')).toEqual(1);
        expect(build.getPath('matrix.firstObject.number')).toEqual(1.1);
      });
    });
  });

  describe('instance', function() {
    var repository, build;

    beforeEach(function() {
      repository = Test.Factory.Repository.travis();
      build = Test.Factory.Job.single();
    });

    describe('associations', function() {
      it('has many tests as a matrix', function() {
        expect(build.get('number')).toEqual(1.9);
      });

      it('belongs to a repository', function() {
        expect(repository.get('slug')).toEqual(repository.get('slug'));
      });
    });

    describe('properties', function() {
      describe('color', function() {
        it('returns "green" if the last build has passed', function() {
          build.set('result', 0);
          expect(build.get('color')).toEqual('green');
        });

        it('returns "red" if the last build has failed', function() {
          build.set('result', 1);
          expect(build.get('color')).toEqual('red');
        });

        it('returns undefined if the last build result is unknown', function() {
          build.set('result', null);
          expect(build.get('color')).toEqual(undefined);
        });
      });

      it('appendLog', function() {
        build.set('log', 'test-1');
        build.appendLog('test-2');
        expect(build.get('log')).toEqual('test-1test-2');
      });
    });
  });

  describe('properties', function() {
    var repository, build, view;

    beforeEach(function() {
      repository = Test.Factory.Repository.travis();
      build = Test.Factory.Job.single();
    });

    describe('configValues', function() {
      it('returns an empty array if the config is undefined', function() {
        build.set('config', null);
        expect(build.get('formattedConfigValues')).toEqual([]);
      });

      // TODO: unfortunately I couldn't figure out how to fix that one. AP
      // it('returns a list of config dimensions for the build matrix table', function() {
      //   build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
      //   expect(build.get('formattedConfigValues')).toEqual([['1.9.2', 'rbx'], ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x']]);
      // });

      it("ignores the .configured key", function() {
        build.set('config', { '.configured': true });
        expect(build.get('formattedConfigValues')).toEqual([]);
      });
    });

    it('commit', function() {
      expect(build.get('formattedCommit')).toEqual('4d7621e (master)');
    });

    describe('duration', function() {
      it("returns a '-' if the build's start time is not known", function() {
        build.set('started_at', null);
        expect(build.get('formattedDuration')).toEqual('-');
      });

      it("returns a human readable duration using the current time if the build's finished time is not known", function() {
        build.set('finished_at', null);
        expect(build.get('formattedDuration')).toEqual('more than 24 hrs');
      });

      it("returns a human readable duration if the build's start and finished times are both known", function() {
        expect(build.get('formattedDuration')).toEqual('10 sec');
      });
    });

    describe('finished_at', function() {
      it("returns a '-' if the build's finished time is not known", function() {
        build.set('finished_at', null);
        expect(build.get('formattedFinishedAt')).toEqual('-');
      });

      it("returns a human readable time ago string if the build's finished time is known", function() {
        spyOn($.timeago, 'now').andReturn(new Date(Date.UTC(2011, 0, 1, 4, 0, 0)).getTime());
        expect(build.get('formattedFinishedAt')).toEqual('about 3 hours ago');
      });
    });

    describe('config', function() {
      it('returns "-" if the config is undefined', function() {
        build.set('config', null);
        expect(build.get('formattedConfig')).toEqual('-');
      });

      it('returns a  displayable config string', function() {
        build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
        expect(build.get('formattedConfig')).toEqual('Rvm: 1.9.2, rbx, Gemfile: Gemfile.rails-2.3.x, Gemfile.rails-3.x');
      });

      it("ignores the .configured key", function() {
        build.set('config', { '.configured': true });
        expect(build.get('formattedConfig')).toEqual('-');
      });
    });

    describe('message', function() {
      it ('changes emoji to image tags', function() {
        build.set('message', 'The :cake: is a lie');
        expect(build.get('formattedMessage')).toEqual('The <img class="emoji" title=":cake:" alt=":cake:" src="/assets/emoji/cake.png"/> is a lie');
      });

      it ('changes multiple emoji to image tags', function() {
        build.set('message', 'I :heart: :cake:');
        expect(build.get('formattedMessage')).toEqual('I <img class="emoji" title=":heart:" alt=":heart:" src="/assets/emoji/heart.png"/> <img class="emoji" title=":cake:" alt=":cake:" src="/assets/emoji/cake.png"/>');
      });

      it ('does not change message without emoji', function() {
        build.set('message', 'Issue: This is normal commit :: Something with ActiveSupport::Callbacks: remove __define_runner');
        expect(build.get('formattedMessage')).toEqual('Issue: This is normal commit :: Something with ActiveSupport::Callbacks: remove __define_runner');
      });

      it ('shows mulitple lines commits in multiple html lines', function() {
        build.set('message', 'First line of commit.\\n\\nSecond line of commit');
        expect(build.get('formattedMessage')).toEqual('First line of commit.<br/><br/>Second line of commit');
      });
    });
  });
});

