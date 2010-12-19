describe('The repository details view', function() {
  beforeEach(function() {
    go_to('#!/repositories/' + INIT_DATA.repositories[1].id)
  });

  it('shows repository details', function() {
    runs_after(200, function() {
      expect_texts('#right .repository', {
        'h3': 'josevalim/enginex',
        '.number': '1',
        '.commit-hash': '565294c',
        '.duration': '20',
        '.finished_at': '2010-11-11T12:00:20Z',
      });
    });
  });

});
