var jsApiReporter;
(function() {
  var jasmineEnv = jasmine.getEnv();

  jsApiReporter = new jasmine.JsApiReporter();
  var trivialReporter = new jasmine.TrivialReporter();

  jasmineEnv.addReporter(jsApiReporter);
  jasmineEnv.addReporter(trivialReporter);

  jasmineEnv.specFilter = function(spec) {
    return trivialReporter.specFilter(spec);
  };

  window.onload = function() {
    jasmineEnv.execute();
    $('body').append($('<div id="jasmine_content"></div>'));
  };
})();


