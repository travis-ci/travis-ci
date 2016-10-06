describe('Views: the build matrix table view', function() {
  beforeEach(function() {
    var repositories = new Travis.Collections.Repositories(eval(jasmine.getFixture('models/repositories.json')));
    repositories.get(1).builds.add(eval(jasmine.getFixture('models/repositories/1/builds.json')));
    this.builds = repositories.get(1).builds.get(3).matrix;

    this.matrix = new Travis.Views.Build.Matrix.Table({ builds: this.builds }).render();
  });

  it('renders the build matrix', function() {
    expect(this.matrix.el).toMatchTable([
      ['Build', 'Gemfile',                  'Rvm'   ], // FIXME  'Finished', 'Duration'
      ['3.1',   'test/Gemfile.rails-2.3.x', '1.8.7' ],
      ['3.2',   'test/Gemfile.rails-3.0.x', '1.8.7' ],
      ['3.3',   'test/Gemfile.rails-2.3.x', '1.9.2' ],
      ['3.4',   'test/Gemfile.rails-3.0.x', '1.9.2' ],
    ]);
    expect(this.matrix.el.find('tbody .green')).toBeEmpty();
  });

  it('updates build status on build:change', function() {
    this.builds.get(4).set({ status: 0 });
    expect(this.matrix.el.find('tbody .green').length).toEqual(1);
  });
  // TODO expect duration, finished_at to be updated
});
