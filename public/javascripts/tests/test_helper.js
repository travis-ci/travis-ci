var __TESTING__ = true

beforeEach(function() {
  window.location.hash = '';
  Travis.start();
  Backbone.history.loadUrl();

  this.left = $('#left').html();
  this.main = $('#main').html();
  this.hash = window.location.hash;
});

afterEach(function() {
  $('#left').html(this.left);
  $('#main').html(this.main);
  window.location.hash = this.hash;
});

var runs_after = function(time, func) {
  waits(time);
  jasmine.getEnv().currentSpec.runs(func);
};

var runs_when = function(condition, func) {
  waitsFor(condition);
  jasmine.getEnv().currentSpec.runs(func);
}

var follow = function(text) {
  var link = $('a:contains("' + text + '")');
  go_to(link.attr('href'));
}

var go_to = function(hash) {
  window.location.hash = normalize_hash(hash);
  Backbone.history.loadUrl();
}

var normalize_hash = function(hash) {
  hash = '#!/' + hash.replace('#!/', '').replace(/^\//, '');
  return hash.replace(/#|!|\//) == '' ? '' : hash;
}
