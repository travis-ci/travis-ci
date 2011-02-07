describe('Views: the build history tab', function() {
  beforeEach(function() {
    go_to('#!/josevalim/enginex/builds');
    waitsFor(build_history_contains_rows(2), 1000, 'the build history to contain 2 rows');
    // waitsFor(build_tab_active('josevalim/enginex', 'history'));
  });

  it('shows a builds list', function() {
    expect_table('#main #builds', [
      ['Build', 'Commit',  'Message',         'Duration', 'Finished'],
      ['#1',    '565294c', 'Update Capybara', '20 sec',   '2 months ago' ]
    ]);
  });
});


