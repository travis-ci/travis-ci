describe('Events: on the build view', function() {
  beforeEach(function() {
    go_to('#!/repositories/' + INIT_DATA.repositories[1].id)
    go_to('#!/builds/' + INIT_DATA.repositories[1].last_build.id)
  });

  describe('build:updated', function() {
    beforeEach(function() {
      var repository = INIT_DATA.repositories[1];
      this.build_data = { id: repository.last_build.id, number: 2, log: ' FOO!', repository: { id: repository.id } };
    });

    it('appends to the build log', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:updated', this.build_data);
        expect_text('#right .log', 'enginex build 1 log ... FOO!')
      });
    });
  });
});
