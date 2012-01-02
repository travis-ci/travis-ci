describe("Travis.Datasource", function() {
  var store, source;
  var responses = {
    repositories: { status: 200, responseText: JSON.stringify([{ id: 1, slug: 'travis-ci/travis-ci' }]) }
  };

  beforeEach(function() {
    store  = Travis.store = Ember.Store.create().from('Travis.DataSource');
    source = store._getDataSource();
  });

  describe('fetch', function() {
    it('fetches a collection and loads it to the store', function() {
      spyOn(store, 'loadRecords');
      var query = Travis.Query.cached(Travis.Repository);
      source.fetch(store, query);
      mostRecentAjaxRequest().response(responses.repositories);
      expect(store.loadRecords).toHaveBeenCalled();
    });

    it('notifies the store that it has fetched the query', function() {
      var query = Travis.Query.cached(Travis.Repository);
      spyOn(store, 'dataSourceDidFetchQuery');
      source.fetch(store, query);
      mostRecentAjaxRequest().response(responses.repositories);
      expect(store.dataSourceDidFetchQuery).toHaveBeenCalledWith(query);
    });
  });

  describe('retrieveRecord', function() {
    it('fetches a single record and loads it to the store', function() {
    });
  });

  it('finding a collection works', function() {
    var repositories = store.find(Travis.Repository);
    mostRecentAjaxRequest().response(responses.repositories);
    expect(repositories.get('length')).toEqual(1);
  });
});

