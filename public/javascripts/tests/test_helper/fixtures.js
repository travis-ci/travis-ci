// Loads fixure markup into the DOM as a child of the jasmine_content div
jasmine.loadFixture = function(fixtureName) {
  var $destination = $('#jasmine_content');

  // get the markup, inject it into the dom
  $destination.html(jasmine.cachedFixture(fixtureName));

  // keep track of fixture count to fail jasmines that
  // call loadFixture() more than once
  jasmine.loadFixtureCount++;
};

// Returns fixture markup as a string. Useful for fixtures that
// represent the response text of ajax requests.
jasmine.getFixture = function(fixtureName) {
  return jasmine.cachedFixture(fixtureName);
};

jasmine.cachedFixture = function(fixtureName) {
  if (!jasmine.fixtureCache[fixtureName]) {
    jasmine.fixtureCache[fixtureName] = jasmine.retrieveFixture(fixtureName);
  }
  return jasmine.fixtureCache[fixtureName];
};

jasmine.retrieveFixture = function(fixtureName) {
  // construct a path to the fixture, including a cache-busting timestamp
  var path = '/javascripts/tests/fixtures/' + fixtureName + "?" + new Date().getTime();
  var xhr;

  // retrieve the fixture markup via xhr request to jasmine server
  try {
    xhr = new jasmine.XmlHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
  } catch(e) {
    throw new Error("couldn't fetch " + path + ": " + e);
  }
  var regExp = new RegExp(/Couldn\\\'t load \/fixture/);
  if (regExp.test(xhr.responseText)) {
    throw new Error("Couldn't load fixture with key: '" + fixtureName + "'. No such file: '" + path + "'.");
  }

  return xhr.responseText;
};

jasmine.loadFixtureCount = 0;
jasmine.fixtureCache = {};

