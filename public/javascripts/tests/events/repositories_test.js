describe('Events: on the repositories list', function() {
  beforeEach(function() {
    var repository = INIT_DATA.repositories[1];
    this.build_data = { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
  });

  describe('build:created', function() {
    beforeEach(function() {
      Travis.app.trigger('build:created', this.build_data)
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
      Travis.app.trigger('build:updated', this.build_data)
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
      Travis.app.trigger('build:created', this.build_data)
      Travis.app.trigger('build:finished', _.extend(this.build_data, { color: 'green', finished_at: '2010-11-11T14:00:20Z' }))
    });

    it('updates the build status color', function() {
      expect_element('#repositories .repository:nth-child(1).green');
    });

    it('stops the repository list item flashing animation', function() {
      expect_no_element('#repositories .repository:nth-child(1):animated');
    });
  });
});

