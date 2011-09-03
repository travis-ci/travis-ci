describe('Collection:', function() {
  beforeEach(function() {
    var Model = Travis.Base.extend({
      url: '/builds/1'
    });
    var Collection = Travis.Collections.Base.extend({
      model: Model,
      url: '/builds'
    })

    this.json = jasmine.getFixture('models/repositories/1/builds.json');
    this.fixtures = eval(this.json);
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', /./, [200, { 'Content-Type': 'application/json' }, this.json]);

    this.collection = new Collection();
    expect(this.collection).toBeEmpty();
  });

  describe('whenFetched with the collection not being loaded', function() {
    it('calls the callback after the collection has been loaded if the collection has not been loaded', function() {
      var loaded;
      this.collection.whenFetched(function(collection) { loaded = (collection.length > 0); });
      this.server.respond();
      expect(loaded).toBeTruthy();
    });

    it('calls the callback after the collection has been loaded if the collection is loading', function() {
      var loaded;
      this.collection.loading = true;
      this.collection.whenFetched(function(collection) { loaded = (collection.length > 0); });
      this.collection.fetch();
      this.server.respond();
      expect(loaded).toBeTruthy();
    });

    it('directly calls the callback if the collection has already been loaded', function() {
      var loaded;
      this.collection.fetch();
      this.server.respond();
      this.collection.whenFetched(function(collection) { loaded = (collection.length > 0); });
      expect(loaded).toBeTruthy();
    });
  });

  it('selected: returns the selected model', function() {
    this.collection.fetch();
    this.server.respond();
    var model = this.collection.get(1);
    model.select();
    expect(this.collection.selected()).toEqual(model);
  });

  describe('with the collection being fetched', function() {
    beforeEach(function() {
      this.collection.fetch();
      this.server.respond();
    });

    it('select: selects the model with the given id', function() {
      this.collection.select(1);
      expect(this.collection.get(1).selected).toBeTruthy();
    });

    it('selectLast: selects the last model in the collection', function() {
      this.collection.selectLast();
      expect(this.collection.last().selected).toBeTruthy();
    });

    it('selectLastBy: selects the model by the given attributes', function() {
      this.collection.selectLastBy({ number: 1 });
      expect(this.collection.get(1).selected).toBeTruthy();
    });

    it('getOrFetchLast: gets the last model', function() {
      this.collection.getOrFetchLast(function(model) {
        expect(model).toEqual(this.collection.last());
      }.bind(this));
    });

    it('getOrFetchBy: gets the last model by the given attributes', function() {
      this.collection.getOrFetchLastBy({ number: 1 }, function(model) {
        expect(model).toEqual(this.collection.get(1));
      }.bind(this));
    });

    it('getOrFetch: gets the model by its id', function() {
      this.collection.getOrFetch(1, function(model) {
        expect(model).toEqual(this.collection.get(1));
      }.bind(this));
    });
  });

  describe('with the collection not being fetched', function() {
    it('select: selects the model with the given id', function() {
      this.collection.select(1);
      this.server.respond();
      expect(this.collection.get(1).selected).toBeTruthy();
    });

    it('selectLast: selects the last model in the collection', function() {
      this.collection.selectLast();
      this.server.respond();
      expect(this.collection.last().selected).toBeTruthy();
    });

    it('selectLastBy: selects the model by the given attributes', function() {
      this.collection.selectLastBy({ number: 1 });
      this.server.respond();
      expect(this.collection.at(0).selected).toBeTruthy();
    });

    it('getOrFetchLast: fetches the collection and then gets the last model', function() {
      var model;
      this.collection.getOrFetchLast(function(m) { model = m; });
      this.server.respond();
      expect(model).toEqual(this.collection.last());
    });

    it('getOrFetchBy: fetches the collection and then gets the last model by the given attributes', function() {
      var model;
      this.collection.getOrFetchLastBy({ number: 1 }, function(m) { model = m });
      this.server.respond();
      expect(model).toEqual(this.collection.get(1));
    });


    it('getOrFetchBy: fetches the collection and then gets the model by its id', function() {
      var model;
      this.collection.getOrFetch(1, function(m) { model = m });
      this.server.respond();
      expect(model).toEqual(this.collection.get(1));
    });
  });


});
