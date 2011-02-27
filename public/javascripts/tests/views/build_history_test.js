describe('Views: the build history tab', function() {
  beforeEach(function() {
    goTo('#!/josevalim/enginex/builds');
    waitsFor(buildHistoryShowsBuilds(1), 1000, 'the build history to contain 1 rows');
    waitsFor(buildHistoryTimesUpdated(), 1000, 'the build history timestamps have been updated to relative times in words');
  });

  it('shows a builds list', function() {
    expectTable('#main #builds', [
      ['Build', 'Commit',  'Message',         'Duration', 'Finished'],
      ['#1',    '565294c', 'Update Capybara', '20 sec',   /\d+ months ago/ ]
    ]);
  });
});


