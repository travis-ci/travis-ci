describe('Views: the build history tab', function() {
  beforeEach(function() {
    goTo('#!/josevalim/enginex/builds');
    waitsFor(buildHistoryContainsRows(1), 1000, 'the build history to contain 2 rows');
    waits(200); // hu?
  });

  it('shows a builds list', function() {
    expectTable('#main #builds', [
      ['Build', 'Commit',  'Message',         'Duration', 'Finished'],
      ['#1',    '565294c', 'Update Capybara', '20 sec',   /\d+ months ago/ ]
    ]);
  });
});


