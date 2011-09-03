describe('Views.Repository', function() {
  var template, repository;

  beforeEach(function() {
    repository = Test.Factory.repositories.travis();
    template = SC.Handlebars.compile(
      '{{#view SC.View id="repositories" contentBinding="Travis.repository"}}' +
      '  <h1>{{slug}}</h1>' +
      '{{/view}}'
    );
  });

  it('works', function() {
    var view = SC.View.create({ template: template });

    withinRunLoop(function() { Travis.set('repository', repository); });
    withinRunLoop(function() { view._insertElementLater(function() {}); });
    withinRunLoop(function() { Travis.set('repository', repository); });

    var slug = 'travis-ci/travis-ci';
    var html = view.$();

    expect(repository.get('slug')).toEqual(slug);
    expect(html).toHaveText(slug);
  });
});
