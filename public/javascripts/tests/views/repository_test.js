describe('The repository details view', function() {
  beforeEach(function() {
    go_to('#!/' + INIT_DATA.repositories[1].name);
  });

  it('shows repository details', function() {
    runs_after(200, function() {
      expect_texts('#main .repository', {
        'h3': 'josevalim/enginex',
        '.number': '1',
        '.commit-hash': '565294c',
        '.commit-message': 'Update Capybara',
        '.duration': '20 seconds',
      });
    });
  });
});
