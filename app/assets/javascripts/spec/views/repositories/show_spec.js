describe('Views:', function() {
  describe('repositories', function() {
    describe('show', function() {
      var repository, controller, view;

      beforeEach(function() {
        $('#main').empty();

        repository = Test.Factory.Repository.travis();
        controller = SC.Object.create({ repository: repository });
        view = SC.View.create({ controller: controller, template: SC.TEMPLATES['app/templates/repositories/show'] });

        SC.run(function() { view.appendTo('#main'); });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows the current repository', function() {
        expect(view.$()).toShowRepository(repository);
      });

      describe('when a repository property changes', function() {
        it('updates the slug', function() {
          SC.run(function() { repository.set('slug', 'updated/slug'); });
          expect(view.$()).toShowRepository(repository);
        });

        it('updates the last build number', function() {
          SC.run(function() { repository.set('lastBuildNumber', '111'); });
          expect(view.$()).toShowRepository(repository);
        });

        it('updates the last build duration and last build finished_at time', function() {
          SC.run(function() { repository.set('lastBuildFinishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$()).toShowRepository(repository);
        });

        it('updates the last build url', function() {
          SC.run(function() { repository.set('lastBuildId', 111); });
          expect(view.$()).toShowRepository(repository);
        });
      });
    });
  });
});
