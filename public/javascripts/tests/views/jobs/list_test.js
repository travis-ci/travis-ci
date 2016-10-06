describe('Views: the job list view', function() {
  beforeEach(function() {
    jasmine.loadFixture('views/jobs_list.html');
    this.jobs = new Travis.Collections.Jobs();
    this.jobs_list = new Travis.Views.Jobs.List();
    this.jobs_list.attachTo(this.jobs);
    this.selector = '#jasmine_content #jobs';

    this.json = jasmine.getFixture('models/jobs.json');
    this.fixtures = eval(this.json);
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', /^\/jobs\?_=\d+$/, [200, { 'Content-Type': 'application/json' }, this.json]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('contains an "empty" placeholder if empty', function() {
    expect($(this.selector)).toFind('.empty');
  });

  it('shows the contents of the jobs collection', function() {
    this.jobs.fetch();
    this.server.respond()
    expect($('li.job', this.selector)[0]).toHaveText('svenfuchs/minimal #1');
    expect($('li.job', this.selector)[1]).toHaveText('svenfuchs/minimal #2');
  });

  it('adds a job to the bottom of the list on job:add', function() {
    this.jobs.add(this.fixtures[0]);
    expect($('li.job', this.selector).last()).toHaveText('svenfuchs/minimal #1');
    this.jobs.add(this.fixtures[1]);
    expect($('li.job', this.selector).last()).toHaveText('svenfuchs/minimal #2');
  });

  it('removes a job from the list on job:remove', function() {
    this.jobs.add(this.fixtures[0]);
    this.jobs.remove(this.jobs.get(1));
    expect($('li:first-child.job'), this.selector).toBeEmpty();
  });
});

