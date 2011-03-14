var __TESTING__ = true

beforeEach(function() {
  window.location.hash = '';
  // Travis.start();
  // Backbone.history.loadUrl();

  $('#jasmine_content').empty();
  storeElements();
  $('#left, #main, #right').empty();
  // this.hash = window.location.hash;
});

afterEach(function() {
  // $('#left').html(this.left);
  // $('#main').html(this.main);
  // window.location.hash = this.hash;
});

jasmine.Env.prototype.loadJson = function(paths) {
  jasmine.json = _.inject(paths, function(json, path) {
    json[path] = jasmine.getFixture(path);
    return json;
  }, {});
};

jasmine.Env.prototype.loadFixtures = function(paths) {
  this.loadJson(paths);
  jasmine.fixtures = _.inject(jasmine.json, function(fixtures, json, path) {
    fixtures[path] = eval(json);
    return fixtures;
  }, {});
}

jasmine.Env.prototype.serveFixtures = function() {
  this.loadFixtures([
    'models/repositories.json',
    'models/repositories/1/builds.json',
    'models/repositories/2/builds.json',
    'models/jobs.json',
    'models/workers.json'
  ]);

  jasmine.server = sinon.fakeServer.create();
  jasmine.server.autoRespond = true;
  _.each(jasmine.json, function(json, path) {
    path = path.replace('models', '').replace('.json', '');
    var response = [200, { 'Content-Type': 'application/json' }, json];
    jasmine.server.respondWith('GET', new RegExp('^' + path + '\\\?_=\\\d+$'), response);
  }.bind(this));

  afterEach(function() { if(this.server) this.server.restore(); });
};

var serveFixtures = function() {
  jasmine.getEnv().serveFixtures();
};

var storeElements = function() {
  jasmine.storedElements = _.inject(['#left', '#main', '#right'], function(elements, selector) {
    elements[selector] = $(selector).html();
    $(selector).empty();
    return elements;
  }, {});
};

var restoreElements = function() {
  _.each(['#left', '#main', '#right'], function(selector) {
    $(selector).html(jasmine.storedElements[selector]);
  });
};

var startApp = function() {
  restoreElements();
  Travis.start();
};

var stopApp = function() {
  restoreElements();
  Travis.app.repositoriesList.detach();
  Travis.app.repositoryShow.detach();
  delete Travis.app;
  delete Backbone.history;
}

var runsAfter = function(time, func) {
  waits(time);
  jasmine.getEnv().currentSpec.runs(func);
};

var runsWhen = function(condition, func) {
  waitsFor(condition);
  jasmine.getEnv().currentSpec.runs(func);
};

var follow = function(text) {
  var link = $('a:contains("' + text + '")');
  goTo(link.attr('href'));
};

var goTo = function(hash) {
  window.location.hash = normalizeHash(hash);
  Backbone.history.loadUrl();
};

var normalizeHash = function(hash) {
  hash = '#!/' + hash.replace(/^\//, '').replace('#!/', '');
  return hash.replace(/#|!|\//) == '' ? '' : hash;
};

