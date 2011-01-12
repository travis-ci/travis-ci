describe('The repositories list', function() {
  it("displays repositories ordered by their last build's started_at time", function() {
    var repositories = $('#repositories .repository');
    expect(repositories.size()).toEqual(2);
    expect($('a:nth-child(1)', repositories[0]).text()).toEqual('svenfuchs/minimal');
    expect($('a:nth-child(1)', repositories[1]).text()).toEqual('josevalim/enginex');
  });

  it('clicking the repository name opens the repository details pane on the main', function() {
    follow('josevalim/enginex');
    runs_after(200, function() {
      expect_element('#main .repository');
    });
  });

  it('clicking the build number opens the build details pane on the main', function() {
    follow('#1');
    runs_after(200, function() {
      expect_element('#main .build');
    });
  });
});
