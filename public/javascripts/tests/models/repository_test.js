describe('Models:', function() {
  describe('Repository', function() {
    beforeEach(function() {
      this.repositories = new Repositories(INIT_DATA.repositories);
      this.repository = this.repositories.models[1];
    });

    it('an initial repository holds the expected attributes', function() {
      expect_attributes(this.repository, {
        name: 'svenfuchs/minimal',
        url: 'https://github.com/svenfuchs/minimal',
        last_duration: 10
      });
    });

    it('has a builds collection', function() {
      expect_attributes(this.repository.builds.models[0], {
        commit: 'add057e',
        log: 'minimal build 3 log ...',
        message: 'unignore Gemfile.lock',
        number: 3,
        started_at: '2010-11-12T13:00:00Z'
      });
    });

    it('does not hold a last_build attribute (but adds it to the builds collection)', function() {
      expect(this.repository.attributes.last_build).toBeUndefined();
    });

    describe('set', function() {
      it('sets the last_build attribute to the builds collection', function() {
        var build_id = this.repository.builds.models[0].get('id');
        this.repository.set({ last_build: { id: build_id, commit: '123456' } });
        expect(this.repository.builds.get(build_id).get('commit')).toEqual('123456');
      });
    });

    it('delegates is_building to its last build', function() {
      expect(this.repository.is_building()).toBeTruthy();
      this.repository.builds.models.pop();
      expect(this.repository.is_building()).toBeFalsy();
    });

    it('toJSON returns the expected data', function() {
      expect_properties(this.repository.toJSON(), {
        name: 'svenfuchs/minimal',
        url: 'https://github.com/svenfuchs/minimal',
        last_duration: 10
      });
    });

    describe('change events', function() {
      it('triggers a "change" event on the repository when a last_duration attribute is passed', function() {
        expect_triggered(this.repository, 'change', function() {
          this.repository.set({ last_duration: 20 })
        }.bind(this));
      });

      it('triggers a "change" event on the build when a finished_at attribute for that build is passed', function() {
        var build = this.repository.builds.last();
        expect_triggered(build, 'change', function() {
          this.repository.set({ last_build: { id: build.id, finished_at: new Date } })
        }.bind(this));
      });

      it('does not trigger a "change" event on the repository when only a last_build attribute is passed', function() {
        var build = this.repository.builds.last();
        expect_not_triggered(this.repository, 'change', function() {
          this.repository.set({ last_build: { id: build.id, finished_at: new Date } })
        }.bind(this));
      });
    });

    describe('builds add event', function() {
      it('triggers build:add on the collection', function() {
        expect_triggered(this.repositories, 'build:add', function() {
          this.repository.builds.add({ number: 2 });
        }.bind(this));
      });

      it('triggers build:add on the repository', function() {
        expect_triggered(this.repository, 'build:add', function() {
          this.repository.builds.add({ number: 2 });
        }.bind(this));
      });
    });

    describe('build change event', function() {
      it('triggers build:change on the collection', function() {
        expect_triggered(this.repositories, 'build:change', function() {
          this.repository.builds.models[0].change();
        }.bind(this));
      });

      it('trigger build:change on the repository', function() {
        expect_triggered(this.repository, 'build:change', function() {
          this.repository.builds.models[0].change();
        }.bind(this));
      });
    });
  });
});

