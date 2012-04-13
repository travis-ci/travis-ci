describe('Travis.Query', function() {
  var query = function(options) {
    return Travis.Query.create({ recordType: Travis.Repository, options: options });
  };

  describe('class methods', function() {
    describe('cached', function() {
      it('generates a new query unless cached', function() {
        var query = Travis.Query.cached(Travis.Repository);
        expect(Ember.typeOf(query)).toEqual('instance');
      });

      it('returns a cached query', function() {
        var cached = function() { return Travis.Query.cached(Travis.Repository) };
        expect(cached()).toEqual(cached());
      });
    });

    describe('key', function() {
      it('returns a serialized version of the arguments', function() {
        expect(Travis.Query.key('local', { recordType: Travis.Repository, options: { id: 1 } })).toEqual('local:/repositories/1.json');
      });
    });
  });

  describe('instance methods', function() {
    describe('path', function() {
      it('returns /repositories.json for a query that looks up a collection', function() {
        expect(query({}).path()).toEqual('/repositories.json');
      });

      it('returns /repositories/1.json for a query that looks up a single record', function() {
        expect(query({ id: 1 }).path()).toEqual('/repositories/1.json');
      });
    });

    describe('params', function() {
      it('returns page=1', function() {
        expect(query({ page: 1 }).params()).toEqual('page=1');
      });

      it('does not include a given id value', function() {
        expect(query({ page: 1, id: 1 }).params()).toEqual('page=1');
      });

      it('does not include a given orderBy value', function() {
        expect(query({ page: 1, orderBy: 'orderBy' }).params()).toEqual('page=1');
      });

      it('returns undefined if no valid params were given', function() {
        expect(query({}).params()).toEqual(undefined);
      });
    });

    describe('url', function() {
      it('returns /repositories.json for a query that does not have any parameters', function() {
        expect(query({}).url()).toEqual('/repositories.json');
      });

      it('returns /repositories.json?page=1 for a query that has extra parameters', function() {
        expect(query({ page: 1 }).url()).toEqual('/repositories.json?page=1');
      });
    });

    describe('conditions', function() {
      it('returns conditions suitable for being used in an Ember.Query', function() {
        expect(query({ slug: 'travis-ci/travis-ci' }).conditions()).toEqual('slug = "travis-ci/travis-ci"');
      });
    });

    describe('quote', function() {
      it('quotes stings', function() {
        expect(query().quote('name', 'string')).toEqual('"string"');
      });

      it('does not quote non-strings', function() {
        expect(query().quote('id', 1)).toEqual(1);
      });
    });
  });
});

