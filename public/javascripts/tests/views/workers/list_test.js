describe('Views: the workers list view', function() {
  beforeEach(function() {
    jasmine.loadFixture('views/workers_list.html');
    this.workers = new Travis.Collections.Workers();
    this.workers_list = new Travis.Views.Workers.List();
    this.workers_list.attachTo(this.workers);
    this.selector = '#jasmine_content #workers';

    this.json = jasmine.getFixture('models/workers.json');
    this.fixtures = eval(this.json);

    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', /^\/workers\?_=\d+$/, [200, { 'Content-Type': 'application/json' }, this.json]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('contains an "empty" placeholder if empty', function() {
    expect($(this.selector)).toFind('.empty');
  });

  it('shows the contents of the workers collection', function() {
    this.workers.fetch();
    this.server.respond()
    expect($('li.worker', this.selector)[0]).toHaveText('worker-1');
    expect($('li.worker', this.selector)[1]).toHaveText('worker-2');
  });

  it('adds a worker to the bottom of the list on worker:add', function() {
    this.workers.add(this.fixtures[0]);
    expect($('li.worker', this.selector).last()).toHaveText('worker-1');
    this.workers.add(this.fixtures[1]);
    expect($('li.worker', this.selector).last()).toHaveText('worker-2');
  });

  it('removes a worker from the list on worker:remove', function() {
    this.workers.add(this.fixtures[0]);
    this.workers.remove(this.workers.models[0]);
    expect($('li:first-child.worker'), this.selector).toBeEmpty();
  });
});


