describe('Events: on the repositories list', function() {
  beforeEach(function() {
    this.repository = INIT_DATA.repositories[1];
  });

  describe('build:created', function() {
    beforeEach(function() {
      Travis.app.trigger('build:created', build_created_data(this.repository))
    });

    it('adds a repositories list item for a new repository', function() {
      // TODO
    });

    it('updates the build number', function() {
      expect_text('#repositories .repository:nth-child(1) .build', '#2');
    });

    it('makes the repository list item flash', function() {
      expect_element('#repositories .repository:nth-child(1):animated');
    });
  });

  describe('build:updated', function() {
    beforeEach(function() {
      Travis.app.trigger('build:updated', build_updated_data(this.repository, ' foo!'))
    });

    it('adds a repositories list item for a new repository', function() {
      // TODO
    });

    it('updates the build number', function() {
      expect_text('#repositories .repository:nth-child(1) .build', '#2');
    });

    it('makes the repository list item flash', function() {
      expect_element('#repositories .repository:nth-child(1):animated');
    });
  });

  describe('build:finished', function() {
    beforeEach(function() {
      Travis.app.trigger('build:created', build_created_data(this.repository))
      Travis.app.trigger('build:finished', build_finished_data(this.repository, { color: 'green' }))
    });

    it('updates the build status color', function() {
      expect_element('#repositories .repository:nth-child(1).green');
    });

    it('stops the repository list item flashing animation', function() {
      expect_no_element('#repositories .repository:nth-child(1):animated');
    });
  });
});

