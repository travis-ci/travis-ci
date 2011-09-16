describe('Views:', function() {
  describe('workers', function() {
    describe('list', function() {
      var workers, view;

      beforeEach(function() {
        workers = Test.Factory.Worker.all();
        view = createView('#workers', { workers: workers, templateName: 'app/templates/workers/list' });
      });

      afterEach(function() {
        view.destroy();
      });

      xit('renders an element per record', function() {
        expect(view.$()).toMatchList([
          'ruby1.worker.travis-ci.org:10000:ruby',
          'ruby1.worker.travis-ci.org:10001:ruby',
          'ruby2.worker.travis-ci.org:20000:ruby',
          'ruby2.worker.travis-ci.org:20001:ruby'
        ]);
      });
    });
  });
});

