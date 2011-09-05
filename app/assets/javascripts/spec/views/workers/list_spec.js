describe('Views:', function() {
  describe('workers', function() {
    describe('list', function() {
      var workers, view;

      beforeEach(function() {
        $('#main').empty();

        workers = Test.Factory.Worker.all();
        view = SC.View.create({ template: SC.TEMPLATES['app/templates/workers/list'] });

        SC.run(function() { view.appendTo('#main'); });
        SC.run(function() { view.set('workers', workers); });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows a list of workers', function() {
        expect(view.$()).toContain('#workers');
      });

      it('renders an element per record', function() {
        expect(view.$('#workers')).toMatchList([
          'ruby1.worker.travis-ci.org:10000:ruby',
          'ruby1.worker.travis-ci.org:10001:ruby',
          'ruby2.worker.travis-ci.org:20000:ruby',
          'ruby2.worker.travis-ci.org:20001:ruby'
        ]);
      });
    });
  });
});

