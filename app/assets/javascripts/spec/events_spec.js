var EVENTS = {
/* These events no longer exist in master
  'build:queued':    { build: { id: 1, number: '11.1' }, repository: { slug: 'travis-ci/travis-ci' } },
  'build:removed':   { build: { id: 1 } },
*/
  'build:finished':  { build: { id: 1, finished_at: '2011-11-11T01:00:00Z', result: 1 }, repository: { id: 1,  slug: 'travis-ci/travis-ci' } },

  'build:started:1': { build: { id: 11, repository_id: 1,  number: '11' }, repository: { id: 1,  slug: 'travis-ci/travis-ci' } },

  'build:started:2': { build: { id: 12, repository_id: 12, number: '12' }, repository: { id: 12, slug: 'svenfuchs/minimal'   } },

  'job:log':     { id: 9, _log: 'Foo.' },

  'job:created': { id: 21, number: '1.2', repository: { slug: 'travis-ci/test-job' } },

  'job:started': { id: 9 },

  'job:finished': { id: 9 }

};

describe('Events:', function() {
  var events = Travis.Controllers.Events.create();
  var queue;

  var receiveEvent = function(event, ix) {
    var data = EVENTS[$.compact([event, ix]).join(':')];
    data = JSON.parse(JSON.stringify(data)); // make sure we pass a clone
    Ember.run(function() { events.receive(event, data); });
  };

  /*



  */
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

  describe('build Events', function() {
    it('adds the build to an existing repository', function() {
      var repository = Test.Factory.Repository.travis();
      var count  = function() { Travis.Repository.all().get('length') };
      var before = count();
      
      receiveEvent('build:started', 1);
      
      var build = Travis.Build.find(11);
      expect(build.get('number')).toEqual(11);
      expect(build.getPath('repository.slug')).toEqual('travis-ci/travis-ci');
      expect(count()).toEqual(before);
    });

    it('adds the build to a new repository', function() {
      var count  = function() { Travis.Repository.all().get('length') };
      var before = count();
      
      receiveEvent('build:started', 2);
      
      var build = Travis.Build.find(12);
      expect(build.get('number')).toEqual(12);
      expect(build.getPath('repository.slug')).toEqual('svenfuchs/minimal');
      expect(count()).toEqual(before);
    });
    
    it('updates the build', function() {
      var build = Test.Factory.Build.passing();
      receiveEvent('build:finished');
      
      expect(build.get('result')).toEqual(1);
      expect(build.get('finished_at')).toEqual('2011-11-11T01:00:00Z');
    });    
  });
});
