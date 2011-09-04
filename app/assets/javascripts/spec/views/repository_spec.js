// TODO these should come from the real app templates
Test.Templates.repository = SC.Handlebars.compile(
  '{{#view id="repository" contentBinding="Travis.Controllers.repository.content"}}' +
  '  {{#with content}}' +
  '    <h3><a {{bindAttr href="urlGithubRepository"}}>{{slug}}</a></h3>' +
  '    <ul class="github-stats">' +
  '      <li><a class="watchers" {{bindAttr href="urlGithubWatchers"}}></a></li>' +
  '      <li><a class="forks" {{bindAttr href="urlGithubNetwork"}}></a></li>' +
  '    </ul>' +
  // '    {{view templateName="tabs"}}' +
  '  {{/with}}' +
  '{{/view}}'
);

describe('Views.Repository', function() {
  var repository, view;

  beforeEach(function() {
    $('#main').empty();

    repository = Test.Factory.Repository.travis();
    view = SC.View.create({ template: Test.Templates.repository });

    SC.run(function() { view.appendTo('#main'); });
    SC.run(function() { Travis.Controllers.repository.set('content', repository); });
  });

  it('shows the current repository', function() {
    expect(view.$()).toShowRepository(repository);
  });

  describe('when the respective repository propertes change', function() {
    it('updates the slug', function() {
      SC.run(function() { repository.set('slug', 'updated/slug'); });
      expect(view.$()).toShowRepository(repository);
    });

    it('updates the last build number', function() {
      SC.run(function() { repository.set('lastBuildNumber', '666'); });
      expect(view.$()).toShowRepository(repository);
    });

    it('updates the last build duration and last build finished_at time', function() {
      SC.run(function() { repository.set('lastBuildFinishedAt', '2011-01-01T03:00:20Z'); });
      expect(view.$()).toShowRepository(repository);
    });

    it('updates the last build url', function() {
      SC.run(function() { repository.set('lastBuildId', 666); });
      expect(view.$()).toShowRepository(repository);
    });
  });
});

