var expectAttributes = function(model, expected) {
  expectProperties(model.attributes, expected);
};

var expectProperties = function(actual, expected) {
  for(var name in expected) {
    expect(actual[name]).toEqual(expected[name]);
  }
};

var expectTriggered = function(object, event, callback) {
  expect(actualTriggeredResult(object, event, callback)).toBeTruthy();
};

var expectNotTriggered = function(object, event, callback) {
  expect(actualTriggeredResult(object, event, callback)).toBeFalsy();
};

var actualTriggeredResult = function(object, event, callback) {
  var triggered = false;
  object.bind(event, function() { triggered = true });
  callback.apply();
  return triggered;
}

var expectElement = function(selector) {
  expect($(selector)).not.toBeEmpty();
};

var expectNoElement = function(selector) {
  expect($(selector)).toBeEmpty();
};

var expectAttributeValue = function(selector, name, expected) {
  expect($(selector).attr(name)).toEqual(expected);
};

var expectTable = function() {
  var args  = Array.prototype.slice.call(arguments);
  var table = args.pop();
  var base  = $(args.pop());
  var headers = table.shift();

  _.each(headers, function(text, ix) {
    var selector = 'thead th:nth-child(' + (ix + 1) + ')';
    expectText(selector, text, base);
  });
  _.each(table, function(cells, row) {
    _.each(cells, function(text, cell) {
      var selector = 'tbody tr:nth-child(' + (row + 1) + ') td:nth-child(' + (cell + 1) + ')';
      expectText(selector, text, base);
    });
  });
};

var expectTexts = function() {
  var args  = Array.prototype.slice.call(arguments);
  var texts = args.pop();
  var base  = args.pop() || '';
  _.each(texts, function(text, selector) {
    expectText(base + ' ' + selector, text);
  });
};

var expectText = function(selector, text, element) {
  var actual = $.trim($(selector, element).text());
  if(typeof text == 'string') {
    expect(actual).toEqual(text);
  } else {
    expect(actual).toMatch(text);
  }
};

var expectCalledAfter = function(object, method, timeout, block) {
  var spy = spyOn(object, method).andCallThrough();
  block.apply(arguments.caller);
  runsAfter(timeout, function() {
    expect(spy).toHaveBeenCalled();
  });
};


