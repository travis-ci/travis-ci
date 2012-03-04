describe('Queue', function() {
  describe('list', function() {
    var jobs, view;

    beforeEach(function() {
      Test.Factory.Repository.recent();
      jobs = Ember.ArrayController.create();
      jobs.set('content', Test.Factory.Job.all())
      view = createView('#jobs', { jobs: jobs, templateName: 'app/templates/queue/show' });
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


