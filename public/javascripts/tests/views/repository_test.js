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
        '.commit-message': 'Update Capybara',
        '.duration': '20',
      });
    });
  });

  describe('events', function() {
    beforeEach(function() {
      var repository = INIT_DATA.repositories[1];
      this.build_data = { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
    });

    it('build:created updates the build number', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:created', this.build_data)
        expect_text('#right .repository .number', '2');
      });
    });

    it('build:created clears the build log', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:created', this.build_data)
        expect_text('#right .repository .log', '');
      });
    });
  });
});
