describe('Views:', function() {
  describe('jobs', function() {
    describe('list', function() {
      var jobs, view;

      beforeEach(function() {
        $('#main').empty();

        jobs = Test.Factory.Job.all();
        view = SC.View.create({ template: SC.TEMPLATES['app/templates/jobs/list'] });

        SC.run(function() { view.appendTo('#main'); });
        SC.run(function() { view.set('jobs', jobs); });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows a list of jobs', function() {
        expect(view.$()).toContain('#jobs');
      });

      it('renders an element per record', function() {
        expect(view.$('#jobs')).toMatchList([
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


