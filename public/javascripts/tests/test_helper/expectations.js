var expect_element = function(selector) {
  expect($(selector)).not.toBeEmpty();
}

var expect_no_element = function(selector) {
  expect($(selector)).toBeEmpty();
}

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


