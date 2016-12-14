var EVENTS = {

  'job:log':     { id: 9, _log: 'Foo.' },

  'job:created': { id: 21, number: '1.2', repository: { slug: 'travis-ci/test-job' } },

  'job:started': { id: 9 },

  'job:finished': { id: 9 },

  'build:started': { build: { id: 2, repository_id: 2, number: 11 }, repository: { id: 2, slug: 'travis-ci/travis-ci' } },

  'build:finished':  { build: { id: 2, repository_id: 2, number: 11, result: 1 }, repository: { id: 2,  slug: 'travis-ci/travis-ci-changed' } }

};

describe('Events:', function() {

  var events = Travis.Controllers.Events.create();
  var queue;

  var receiveEvent = function(event, ix) {
    var data = EVENTS[$.compact([event, ix]).join(':')];
    data = JSON.parse(JSON.stringify(data)); // make sure we pass a clone
    Ember.run(function() { events.receive(event, data); });
  };

  describe('job Events', function() {
    it('appends log data to an existing jobs log', function() {
      var test = Test.Factory.Job.single();
      receiveEvent('job:log');
      expect(test.get('log')).toEqual('Done. Build script exited with: 0\nFoo.');

    });

    it('adds a job when a new job is created', function() {
      var test = Test.Factory.Job.single();
      current = Travis.Job.all().get('length')
      receiveEvent('job:created');
      expect(Travis.Job.all().get('length')).toEqual(current+1);
    });

    it('job gets marked as started when it is started', function() {
      var test = Test.Factory.Job.single();
      receiveEvent('job:started');
      expect(test.get('state')).toEqual('started');
    });

    it('job gets marked as finished when it is finished', function() {
      var test = Test.Factory.Job.single();
      receiveEvent('job:finished');
      expect(test.get('state')).toEqual('finished');
    });
  });

  describe('updateFrom', function() {
    it('creates and updates repositories and builds', function() {

      expect(Travis.Repository.all().get('length')).toEqual(0);
      expect(Travis.Build.all().get('length')).toEqual(0);

      receiveEvent('build:started');
      var def = EVENTS['build:started']
      //added
      expect(Travis.Repository.all().get('length')).toEqual(1);
      expect(Travis.Build.all().get('length')).toEqual(1);

      //accurate
      var build = Travis.store.find(Travis.Build,def.build.id)
      var repo = Travis.store.find(Travis.Repository, def.repository.id)
      expect(build.get('number')).toEqual(def.build.number);
      expect(repo.get('slug')).toEqual(def.repository.slug)
      expect(build.get('result')).toEqual(null);

      //updated
      receiveEvent('build:finished');
      def = EVENTS['build:finished']
      build = Travis.store.find(Travis.Build,def.build.id)
      expect(build.get('result')).toEqual(def.build.result);

    });
  });

});
