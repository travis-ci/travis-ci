describe('The repositories list', function() {
  it('displays repositories', function() {
    var repositories = $('#repositories .repository');
    expect(repositories.size()).toEqual(2);
  });

  it('clicking the repository name opens the repository details pane on the right', function() {
    follow('josevalim/enginex');
    runs_after(200, function() {
      expect_element('#right .repository');
    });
  });

  it('clicking the build number opens the build details pane on the right', function() {
    follow('#1');
    runs_after(200, function() {
      expect_element('#right .build');
    });
  });
});
