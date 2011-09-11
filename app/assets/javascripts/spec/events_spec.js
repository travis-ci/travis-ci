var EVENTS = {
  'build:queued':    { build: { id: 1, number: '11.1' }, repository: { slug: 'travis-ci/travis-ci' } },
  'build:removed':   { build: { id: 1 } },
  'build:finished':  { build: { id: 1, finished_at: '2011-11-11T01:00:00Z', status: 1 }, repository: { id: 1,  slug: 'travis-ci/travis-ci' } },
  'build:started:1': { build: { id: 11, repository_id: 1,  number: '11' }, repository: { id: 1,  slug: 'travis-ci/travis-ci' } },
  'build:started:2': { build: { id: 12, repository_id: 12, number: '12' }, repository: { id: 12, slug: 'svenfuchs/minimal'   } },
  'build:log:1':     { build: { id: 2, _log: 'Foo.' } },
}

describe('Events:', function() {
  var events = Travis.Controllers.Events.create();
  var queue;

  var receiveEvent = function(event, ix) {
    var data = EVENTS[$.compact([event, ix]).join(':')];
    data = JSON.parse(JSON.stringify(data)); // make sure we pass a clone
    SC.run(function() { events.receive(event, data); });
  };

  beforeEach(function() {
    queue = createView('#jobs', { jobs: Travis.Job.all(), template: 'app/templates/jobs/list' });
  });

  describe('build:queued', function() {
    it('adds the job to the queue', function() {
      receiveEvent('build:queued');
      expect(queue.$('ul').html()).toHaveText('travis-ci/travis-ci #11.1');
    });
  });

  describe('build:removed', function() {
    xit('build:removed event removes the job from the queue', function() {
      receiveEvent('build:queued');
      receiveEvent('build:removed');
      expect(queue.$('ul').html()).toHaveText('No jobs');
    });
  });

  describe('build:started', function() {
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
  });

  describe('build:log', function() {
    it('appends to an existing build', function() {
      var build = Test.Factory.Build.passing();
      var test = build.get('matrix').objectAt(0);

      receiveEvent('build:started', 1);
      receiveEvent('build:log', 1);

      expect(test.get('log')).toEqual('Done. Build script exited with: 0\nFoo.');
    });
  });

  describe('build:finished', function() {
    xit('removes the job from the queue', function() {
      Test.Factory.Build.passing();
      receiveEvent('build:queued');
      receiveEvent('build:finished');
      expect(queue.$('ul').html()).toHaveText('No jobs');
    });

    it('updates the build', function() {
      var build = Test.Factory.Build.passing();
      receiveEvent('build:finished');

      expect(build.get('result')).toEqual(1);
      expect(build.get('finishedAt')).toEqual('2011-11-11T01:00:00Z');
    });
  });
});
