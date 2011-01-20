describe('Views: the current build tab', function() {
  beforeEach(function() {
    var repository = INIT_DATA.repositories[1];
    go_to('#!/' + repository.name);
    waitsFor(build_tab_active(repository.name, 'current'));
  });

  it('shows repository details', function() {
    expect_texts('#main .repository', {
      'h3': 'josevalim/enginex',
      '.number': '1',
      '.commit-hash': '565294c',
      '.commit-message': 'Update Capybara',
      '.duration': '20 seconds',
    });
  });
});
