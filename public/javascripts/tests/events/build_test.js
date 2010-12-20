describe('Events: on the build view', function() {
  beforeEach(function() {
    go_to('#!/repositories/' + INIT_DATA.repositories[1].id)
    go_to('#!/builds/' + INIT_DATA.repositories[1].last_build.id)
  });

  describe('an incoming event for the current build', function() {
    beforeEach(function() {
      var repository = INIT_DATA.repositories[1];
      this.build_data = { id: repository.last_build.id, number: 2, append_log: ' foo!', repository: { id: repository.id } };
    });

    it('build:updated appends to the build log', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:updated', this.build_data);
        expect_text('#right .log', 'enginex build 1 log ... foo!')
      });
    });
  });

  describe('an incoming event for a different build', function() {
    beforeEach(function() {
      var repository = INIT_DATA.repositories[0];
      this.build_data = { id: repository.last_build.id, number: 4, append_log: ' bar!', repository: { id: repository.id } };
    });

    it('build:updated does not append to the build log', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:updated', this.build_data);
        expect_text('#right .log', 'enginex build 1 log ...')
      });
    });
  });
});
