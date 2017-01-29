// TODO somehow make this accessible through cli
// SC.LOG_BINDINGS = true;

var Test = {
  html: '<div id="tab_recent"><div class="tab"></div></div>' +
    '<div id="main"></div>' +
    '<div id="workers"></div>' +
    '<div id="jobs"></div>'
};

beforeEach(function() {
  Travis.Query._cache = {};
  Travis.store = SC.Store.create().from('Travis.DataSource');
  jasmine.Ajax.useMock();

  // We add these html elements in the specs so we can look at styled content
  // when run in the browser. For jasmine-headless-webkit we therefor need to
  // inject them to the dom.
  if(window.JHW) $('#jasmine_content').html(Test.html);

  $.each(['#tab_recent .tab', '#main', '#workers', '#jobs'], function(ix, selector) {
    $(selector).empty();
  });
});

var createView = function(selector, options) {
  var view = Travis.View.create(options);
  SC.run(function() { view.appendTo(selector) });
  return view;
};

var withinRunLoop = function(block) {
  SC.RunLoop.begin();
  var result = block();
  SC.RunLoop.end();
  return result;
};

var whenReady = function(object, callback) {
  waitsFor(function() {
    return object.get('status') & SC.Record.READY;
  });
  runs(function() {
    callback();
  });
};

var runsAfter = function(time, func) {
  waits(time);
  jasmine.getEnv().currentSpec.runs(func);
};

var runsWhen = function(condition, func) {
  waitsFor(condition);
  jasmine.getEnv().currentSpec.runs(func);
};

$('document').ready(function() {
  $('body').append($('<div id="jasmine_content"></div>'));
});

