// TODO these should come from the real app templates
Templates = {
  repositories: SC.Handlebars.compile(
    '{{#collection tagName="ul" id="repositories" contentBinding="Travis.Controllers.repositories" itemClassBinding="content.cssClasses"}}' +
    '  {{#with content}}' +
    '    <a {{bindAttr href="urlCurrent"}} class="slug">{{slug}}</a>' +
    '    <a {{bindAttr href="urlLastBuild"}} class="build">#{{lastBuildNumber}}</a>' +
    '    <p class="summary">' +
    '      <span class="duration_label">Duration:</span> <abbr class="duration" {{bindAttr title="lastBuildDuration"}}>{{formattedLastBuildDuration}}</abbr>,' +
    '      <span class="finished_at_label">Finished:</span> <abbr class="finished_at timeago" {{bindAttr title="lastBuildFinishedAt"}}>{{formattedLastBuildFinishedAt}}</abbr>' +
    '    </p>' +
    '    <span class="indicator"></span>' +
    '  {{/with}}' +
    '{{/collection}}'
  )
}

describe('Views.Repositories', function() {
  var repositories, view;

  beforeEach(function() {
    $('#tab_recent .tab').empty();
    repositories = Test.Factory.Repository.latest();
    view = SC.View.create({ template: Templates['repositories'] });
    SC.run(function() { view.appendTo('#tab_recent .tab'); });
    SC.run(function() { Travis.Controllers.repositories.set('content', repositories); });
  });

  it('lists repositories', function() {
    expect(view.$()).toListRepositories(repositories);
  });

  describe('when the respective repository propertes change', function() {
    it('updates the slug', function() {
      SC.run(function() { repositories.objectAt(0).set('slug', 'updated/slug'); });
      expect(view.$()).toListRepositories(repositories);
    });

    it('updates the last build number', function() {
      SC.run(function() { repositories.objectAt(0).set('lastBuildNumber', '666'); });
      expect(view.$()).toListRepositories(repositories);
    });

    it('updates the last build duration and last build finished_at time', function() {
      SC.run(function() { repositories.objectAt(0).set('lastBuildFinishedAt', '2011-01-01T03:00:20Z'); });
      expect(view.$()).toListRepositories(repositories);
    });

    it('updates the last build url', function() {
      SC.run(function() { repositories.objectAt(0).set('lastBuildId', 666); });
      expect(view.$()).toListRepositories(repositories);
    });
  });

  describe('when a new repository is pushed to the collection', function() {
    it('adds a list item to the top', function() {
      SC.run(function() { cookbooks = Test.Factory.Repository.cookbooks() });
      expect(view.$('li:first-child a.slug')).toHaveText('travis-ci/travis-cookbooks');
    });
  });
});
