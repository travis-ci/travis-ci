var expect_attributes = function(model, expected) {
  expect_properties(model.attributes, expected);
};

var expect_properties = function(actual, expected) {
  for(var name in expected) {
    expect(actual[name]).toEqual(expected[name]);
  }
};

var expect_triggered = function(object, event, callback) {
  expect(actual_triggered_result(object, event, callback)).toBeTruthy();
};

var expect_not_triggered = function(object, event, callback) {
  expect(actual_triggered_result(object, event, callback)).toBeFalsy();
};

var actual_triggered_result = function(object, event, callback) {
  var triggered = false;
  object.bind(event, function() { triggered = true });
  callback.apply();
  return triggered;
}

var expect_element = function(selector) {
  expect($(selector)).not.toBeEmpty();
};

var expect_no_element = function(selector) {
  expect($(selector)).toBeEmpty();
};

var expect_attribute_value = function(selector, name, expected) {
  expect($(selector).attr(name)).toEqual(expected);
};

var expect_texts = function() {
  var args  = Array.prototype.slice.call(arguments);
  var texts = args.pop();
  var base  = args.pop() || '';
  _.each(texts, function(text, selector) {
    expect_text(base + ' ' + selector, text);
  });
};

var expect_text = function(selector, text) {
  var actual = $.trim($(selector).text());
  expect(actual).toEqual(text);
};

var expect_called_after = function(object, method, timeout, block) {
  var spy = spyOn(object, method).andCallThrough();
  block.apply(arguments.caller);
  runs_after(timeout, function() {
    expect(spy).toHaveBeenCalled();
  });
};


