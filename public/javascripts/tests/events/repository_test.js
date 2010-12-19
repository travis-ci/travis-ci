describe('Events: on the repository view', function() {
  beforeEach(function() {
    go_to('#!/repositories/' + INIT_DATA.repositories[1].id)
  });

  describe('build:created', function() {
    beforeEach(function() {
      var repository = INIT_DATA.repositories[1];
      this.build_data = { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
    });

    it('updates the build number', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:created', this.build_data)
        expect_text('#right .repository .number', '2');
      });
    });
  });
});
