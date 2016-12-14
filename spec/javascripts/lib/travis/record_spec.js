describe('Travis.Record', function() {
  describe('class methods', function() {
    describe('all', function() {
      var data_source;

      beforeEach(function() {
        data_source = Travis.store._getDataSource();
      });

      it('calls fetch on the datasource passing a local query', function() {
        var query;
        spyOn(data_source, 'fetch').andCallFake(function() { query = arguments[1]; });
        Travis.Repository.all();
        expect(query.get('isLocal')).toBeTruthy();
      });

      it('returns a RecordArray with the records loaded', function() {
        var repositories = Travis.Repository.all();
        var response = { status: 200, responseText: JSON.stringify([{ id: 1, slug: 'travis-ci/travis-ci' }])};
        mostRecentAjaxRequest().response(response);

        whenReady(repositories, function() {
          expect(repositories.get('length')).toEqual(1);
          expect(repositories.objectAt(0).get('slug')).toEqual('travis-ci/travis-ci');
        });
      });

      it('requests GET /repositories.json when given no further parameters', function() {
        Travis.Repository.all();
        expect(mostRecentAjaxRequest().url).toEqual('/repositories.json');
      });

      it('requests GET /repositories.json?page=1 when given parameters', function() {
        Travis.Repository.all({ page: 1 });
        expect(mostRecentAjaxRequest().url).toEqual('/repositories.json?page=1');
      });
    });
  });

  describe('instance methods', function() {
    describe('update', function() {
      it('sets the given attributes', function() {
        var repository = Test.Factory.Repository.travis();
        repository.update({ name: 'bob-the-builder' });

        repository = Travis.Repository.find(repository.get('id'));
        expect(repository.get('name')).toEqual('bob-the-builder');
      });
    });
  });
});
