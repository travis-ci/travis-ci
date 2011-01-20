describe('Views: the build tab', function() {
  beforeEach(function() {
    this.repository = INIT_DATA.repositories[1];
    go_to('#!/josevalim/enginex/builds/' + this.repository.last_build.id);
    waitsFor(build_tab_active(this.repository.name, 'build'));
  });

  it('shows build details', function() {
    expect_text('#main h3', this.repository.name);
    expect_texts('#tab_build.active', {
      'h5': 'Build #1',
      '.commit-hash': '565294c',
      '.commit-message': 'Update Capybara',
      '.duration': '20 seconds',
      '.log': 'enginex build 1 log ...'
    });
  });
});
