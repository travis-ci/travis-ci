describe('Views: the current build view', function() {
  beforeEach(function() {
    this.repositories = new Travis.Collections.Repositories(eval(jasmine.getFixture('models/repositories.json')));
    this.repository = this.repositories.get(1)
    this.repository.builds.add(eval(jasmine.getFixture('models/repositories/1/builds.json')));
  });

  var it_renders_the_build_summary = function() {
    it('renders the build summary', function() {
      expect(this.current.el.find('.summary')).not.toBeEmpty();
    });
  };

  var it_updates_the_build_status_on_build_change = function() {
    it('updates the build status on build:change', function() {
      this.build.set({ status: 0 });
      expect(this.current.el.find('.green')).not.toBeEmpty();
    });
  }

  describe('with a normal build', function() {
    beforeEach(function() {
      this.build = this.repository.builds.get(1);
      this.current = new Travis.Views.Build.Current().render();
      this.current.attachTo(this.repository);
      this.repository.builds.trigger('select', this.build);
    });

    it_renders_the_build_summary();
    it_updates_the_build_status_on_build_change();

    it('renders the build log', function() {
      expect(this.current.el.find('.log')).not.toBeEmpty();
    });
  });

  describe('with a matrix build', function() {
    beforeEach(function() {
      this.build = this.repository.builds.get(3);
      this.current = new Travis.Views.Build.Current().render();
      this.current.attachTo(this.repository);
      this.repository.builds.trigger('select', this.build);
    });

    it_renders_the_build_summary();
    it_updates_the_build_status_on_build_change();

    it('renders the build log', function() {
      expect(this.current.el.find('#matrix')).not.toBeEmpty();
    });
  });
});

