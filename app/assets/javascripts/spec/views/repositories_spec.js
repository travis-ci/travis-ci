describe('Views.Repositories', function() {
  var repositories, view;

  beforeEach(function() {
    repositories = Test.Factory.repositories.latest();
    view = SC.View.create({
      template: SC.Handlebars.compile(
        '{{#collection tagName="ul" contentBinding="Travis.Controllers.repositories"}}' +
        '  <a {{bindAttr href="content.slug"}}>{{content.slug}}</a>' +
        '{{/collection}}'
      )
    });
    SC.run(function() { view.appendTo('body'); });
  });

  it('foo', function() {
    SC.run(function() { Travis.Controllers.repositories.set('content', repositories); });
    expect($(view.$('li a')[0])).toHaveText('travis-ci/travis-ci');
    expect($(view.$('li a')[1])).toHaveText('travis-ci/travis-worker');
  });
});
