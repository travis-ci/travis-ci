describe('Views: the build tab', function() {
  beforeEach(function() {
    this.repository = INIT_DATA.repositories[1];
    goTo('#!/josevalim/enginex/builds/' + this.repository.last_build.id);
    waitsFor(buildTabActive(this.repository.name, 'build'));
  });

  it('shows build details', function() {
    expectText('#main h3', this.repository.name);
    expectTexts('#tab_build.active', {
      'h5': 'Build #1',
      '.commit-hash': '565294c',
      '.commit-message': 'Update Capybara',
      '.duration': '20 sec',
      '.log': 'enginex build 1 log ...'
    });
  });
});
