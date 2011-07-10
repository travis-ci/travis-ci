var __TESTING__ = true
var FIXTURES = [
  'models/repositories.json',
  'models/repositories/1/builds.json',
  'models/repositories/2/builds.json',
  'models/builds/1.json',
  'models/builds/2.json',
  'models/builds/3.json',
  'models/builds/4.json',
  'models/builds/5.json',
  'models/builds/6.json',
  'models/builds/7.json',
  'models/builds/8.json',
  'models/jobs.json',
  'models/workers.json'
];

beforeEach(function() {
  window.location.hash = '';
  $('#jasmine_content').empty();
  storeElements();
  serveFixtures();

  jasmine.clock = sinon.useFakeTimers(Date.parse('2010-11-12T17:00:30Z'), 'Date');
});

afterEach(function() {
  jasmine.clock.restore();
});

var loadJson = function(paths) {
  jasmine.json = _.inject(paths, function(json, path) {
    json[path] = jasmine.getFixture(path);
    return json;
  }, {});
};

var loadFixtures = function(paths) {
  loadJson(paths);
  jasmine.fixtures = _.inject(jasmine.json, function(fixtures, json, path) {
    fixtures[path] = JSON.parse(json);
    return fixtures;
  }, {});
}

var serveFixtures = function() {
  this.loadFixtures(FIXTURES);

  jasmine.server = sinon.fakeServer.create();
  jasmine.server.autoRespond = true;
  _.each(jasmine.json, function(json, path) {
    path = path.replace('models', '').replace('.json', '');
    var response = [200, { 'Content-Type': 'application/json' }, json];
    jasmine.server.respondWith('GET', new RegExp('^' + path + '\\\?_=\\\d+$'), response);
  }.bind(this));
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
  Backbone.history.start();
};

var stopApp = function() {
  restoreElements();
  if(Travis.app) {
    Travis.app.repositoriesList.detach();
    Travis.app.repositoryShow.detach();
  }
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

var follow = function(text, context) {
  runs(function() {
    var link = $('a:contains("' + text + '")', context);
    if(link.length == 0) {
      throw('could not find a link "' + text + '"')
    }
    goTo(link.attr('href'));
  });
};

var goTo = function(hash, expectations) {
  runs(function() {
    window.location.hash = normalizeHash(hash);
    Backbone.history.loadUrl();
  });
  if(expectations) runs(expectations);
};

var normalizeHash = function(hash) {
  hash = '#!/' + hash.replace(/^\//, '').replace('#!/', '');
  return hash.replace(/#|!|\//) == '' ? '' : hash;
};

var mockFilterLog = function () {
  window.original_utils_process = Utils.filterLog
  Utils.filterLog = function(string) {
    return string;
  }
}

var unmockFilterLog = function () {
  Utils.filterLog = window.original_utils_process
}