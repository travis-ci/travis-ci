// don't include if we're running in jasmine-headless-webkit

if(window.JHW === undefined) {
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
    };
  })();
}
