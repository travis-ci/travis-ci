describe('Views: the build summary view', function() {
  beforeEach(function() {
    var repositories = new Travis.Collections.Repositories(eval(jasmine.getFixture('models/repositories.json')));
    var repository = repositories.get(1);
    repository.builds.add(eval(jasmine.getFixture('models/repositories/1/builds.json')));
    build = repository.builds.get(1);

    this.summary = new Travis.Views.Build.Summary({ model: build }).render();
  });

  it('renders the build summary', function() {
    expect(this.summary.el).toHaveTexts({
      '.number': 1,
      '.commit-hash': '1a738d9 (master)',
      '.commit-message': 'add Gemfile',
      '.committer': 'Sven Fuchs',
      // FIXME
      // '.author': 'Sven Fuchs'
      // '.finished_at': 'some time ago',
      // '.duration': '8 secs',
    });
    expect(this.summary.el).toHaveDomAttributes({
      '.number a':    { href: '/#!/svenfuchs/minimal/builds/1' },
      '.finished_at': { title: '2010-11-12T12:00:08Z' },
      '.duration':    { title: 8 }
    })
  });

  // TODO test events/updates
});
