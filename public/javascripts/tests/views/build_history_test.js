describe('Views: the build history tab', function() {
  beforeEach(function() {
    goTo('#!/josevalim/enginex/builds');
    waitsFor(buildHistoryContainsRows(2), 1000, 'the build history to contain 2 rows');
  });

  it('shows a builds list', function() {
    expectTable('#main #builds', [
      ['Build', 'Commit',  'Message',         'Duration', 'Finished'],
      ['#1',    '565294c', 'Update Capybara', '20 sec',   /\d+ months ago/ ]
    ]);
  });
});


