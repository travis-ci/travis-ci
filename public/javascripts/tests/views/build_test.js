describe('The build details view', function() {
  beforeEach(function() {
    go_to('#!/' + INIT_DATA.repositories[1].name + '/builds/' + INIT_DATA.repositories[1].last_build.id);
  });

  it('shows build details', function() {
    runs_after(300, function() {
      expect_texts('#main .build', {
        'h3': 'josevalim/enginex',
        'h4': 'Build #1',
        '.commit-hash': '565294c',
        '.commit-message': 'Update Capybara',
        '.duration': '20 seconds',
        '.log': 'enginex build 1 log ...'
      });
    });
  });
});

