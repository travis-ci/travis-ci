describe('Views: the build history table view', function() {
  beforeEach(function() {
    var repositories = new Travis.Collections.Repositories(eval(jasmine.getFixture('models/repositories.json')));
    var repository = repositories.get(1);
    this.builds = repository.builds;
    this.builds.add(eval(jasmine.getFixture('models/repositories/1/builds.json')));

    this.history = new Travis.Views.Build.History.Table({ repository: repository }).render();
  });

  it('renders the build history', function() {
    expect(this.history.el).toMatchTable([
      ['Build', 'Commit',  'Message',              ],
      ['3',     'add057e (master)', 'unignore Gemfile.lock' ],
      ['2',     '91d1b7b (master)', 'Bump to 0.0.22'        ],
      ['1',     '1a738d9 (master)', 'add Gemfile'           ]
    ]);
    expect(this.history.el.find('tbody .green').length).toEqual(1);
  });

  it('updates build status on build:change', function() {
    this.builds.get(3).set({ status: 0 });
    expect(this.history.el.find('tbody .green').length).toEqual(2);
  });
  // TODO expect duration, finished_at to be updated

  it('prepends new builds to the list', function() {
    this.builds.add({ number: '4', commit: '1234567', message: 'the commit message' });
    expect(this.history.el).toMatchTable([
      ['Build', 'Commit',  'Message',              ],
      ['4',     '1234567', 'the commit message'    ]
    ]);
  });
});

