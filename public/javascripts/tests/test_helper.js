var __TESTING__ = true

beforeEach(function() {
  window.location.hash = '';
  // Travis.start();
  // Backbone.history.loadUrl();

  $('#jasmine_content').empty();
  $('#left, #main, #right').empty();
  // this.left = $('#left').html();
  // this.main = $('#main').html();
  // this.hash = window.location.hash;
});

afterEach(function() {
  // $('#left').html(this.left);
  // $('#main').html(this.main);
  // window.location.hash = this.hash;
});

var runsAfter = function(time, func) {
  waits(time);
  jasmine.getEnv().currentSpec.runs(func);
};

var runsWhen = function(condition, func) {
  waitsFor(condition);
  jasmine.getEnv().currentSpec.runs(func);
}

var follow = function(text) {
  var link = $('a:contains("' + text + '")');
  goTo(link.attr('href'));
}

var goTo = function(hash) {
  window.location.hash = normalizeHash(hash);
  Backbone.history.loadUrl();
}

var normalizeHash = function(hash) {
  hash = '#!/' + hash.replace('#!/', '').replace(/^\//, '');
  return hash.replace(/#|!|\//) == '' ? '' : hash;
}

