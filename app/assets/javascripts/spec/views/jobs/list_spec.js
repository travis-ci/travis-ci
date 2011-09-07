describe('Views:', function() {
  describe('jobs', function() {
    describe('list', function() {
      var jobs, view;

      beforeEach(function() {
        jobs = Test.Factory.Job.all();
        view = SC.View.create({ jobs: jobs, template: SC.TEMPLATES['app/templates/jobs/list'] });

        SC.run(function() { view.appendTo('#jobs'); });
      });

      afterEach(function() {
        view.destroy();
      });

      it('renders an element per record', function() {
        expect(view.$()).toMatchList([
          'travis-ci/travis-ci',
          'travis-ci/travis-worker',
          'travis-ci/travis-ci #1',
          'travis-ci/travis-worker #2',
          'travis-ci/travis-ci #1.1',
          'travis-ci/travis-ci #1.2',
          'travis-ci/travis-worker #2.1',
          'travis-ci/travis-worker #2.2'
        ]);
      });
    });
  });
});


