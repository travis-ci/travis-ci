describe('The build details view', function() {
  beforeEach(function() {
    go_to('#!/builds/' + INIT_DATA.repositories[1].last_build.id)
  });

  it('shows build details', function() {
    runs_after(200, function() {
      expect_texts('#right .build', {
        'h3': 'Build #1',
        '.commit-hash': '565294c',
        '.commit-message': 'Update Capybara',
        '.duration': '20',
        '.finished_at': '2010-11-11T12:00:20Z',
        '.log': 'enginex build 1 log ...'
      });
    });
  });
});

