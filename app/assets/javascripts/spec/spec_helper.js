Test = {};

beforeEach(function() {
  Travis.Query._cache = {};
  Travis.store = SC.Store.create().from('Travis.DataSource');
  jasmine.Ajax.useMock();
  $('#jasmine_content').empty();
});

var withinRunLoop = function(block) {
  SC.RunLoop.begin();
  var result = block();
  SC.RunLoop.end();
  return result;
};

var whenReady = function(object, callback) {
  waitsFor(function() {
    // var path = object.kindOf(SC.ChildArray) ? 'firstObject.status' : 'status';
    var path = 'status';
    return object.getPath(path) & SC.Record.READY;
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

