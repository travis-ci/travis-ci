describe('Views: the repositories list', function() {
  beforeEach(function() {
    goTo('#!/');
    waitsFor(repositoriesListPopulated(2));
  });

  it("displays repositories ordered by their last build's started_at time", function() {
    var repositories = $('#repositories .repository');
    expect(repositories.size()).toEqual(2);
    expect($('a:nth-child(1)', repositories[0]).text()).toEqual('svenfuchs/minimal');
    expect($('a:nth-child(1)', repositories[1]).text()).toEqual('josevalim/enginex');
  });

  it('clicking the repository name opens the repository details pane on the main', function() {
    follow('josevalim/enginex');
    expectElement('#main .repository');
  });

  it('clicking the build number opens the build details pane on the main', function() {
    follow('#1');
    expectElement('#main .build');
  });

  it('sets the current repository', function() {
    expect($('#repositories .repository:nth-child(1)').hasClass('current'))
    expect(!$('#repositories .repository:nth-child(2)').hasClass('current'))

    follow('josevalim/enginex');
    expect($('#repositories .repository:nth-child(1)').hasClass('current'))
  });
});
