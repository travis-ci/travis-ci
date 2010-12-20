describe('Events: on the repository view', function() {
  beforeEach(function() {
    go_to('#!/repositories/' + INIT_DATA.repositories[1].id)
  });

  describe('an incoming event for the current repository', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[1];
    });

    it('build:created updates the build number', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:created', build_created_data(this.repository));
        expect_text('#right .repository .number', '2');
      });
    });

    it('build:updated updates the build number', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:updated', build_updated_data(this.repository, { append_log: ' foo!'}));
        expect_text('#right .repository .number', '2');
      });
    });

    it('build:updated appends to the build log', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:updated', build_updated_data(this.repository, { append_log: ' foo!'}));
        expect_text('#right .log', 'enginex build 1 log ... foo!')
      });
    });
  });

  describe('an incoming event for different repository', function() {
    beforeEach(function() {
      this.repository = INIT_DATA.repositories[0];
    });

    it('build:created does not update the build number', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:created', build_created_data(this.repository));
        expect_text('#right .repository .number', '1');
      });
    });

    it('build:updated does not update the build number', function() {
      runs_after(200, function() {
        Travis.app.trigger('build:updated', build_updated_data(this.repository, { append_log: ' foo!'}));
        expect_text('#right .repository .number', '1');
      });
    });
  });
});
