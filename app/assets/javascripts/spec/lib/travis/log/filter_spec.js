describe("Travis.Log", function() {
  describe('stripPaths', function() {
    it('removes the path to the build directory in /tmp', function() {
      var source = 'foo\n/tmp/travis/builds/svenfuchs/rails/activesupport/lib/active_support/core_ext/hash/slice.rb:15';
      var result = 'foo\nactivesupport/lib/active_support/core_ext/hash/slice.rb:15'
      expect(Travis.Log.stripPaths(source)).toEqual(result);
    });
  });

  describe('escapeHtml', function() {
    it('escapes html tags', function() {
      var source = '<foo>bar</foo>';
      var result = '&lt;foo&gt;bar&lt;/foo&gt;';
      expect(Travis.Log.escapeHtml(source)).toEqual(result);
    });
  });

  describe('escapeRuby', function() {
    it('escapes ruby style object output', function() {
      var source = '#<Object:0x00000005fb3628>';
      var result = '#&lt;Object:0x00000005fb3628&gt;';
      expect(Travis.Log.escapeRuby(source)).toEqual(result);
    });
  });

  describe('numberLines', function() {
    it('wraps each line into a p tag including an anchor', function() {
      spyOn(Travis.Log, 'location').andReturn('#!travis-ci/travis-ci/L99');

      var source = Travis.Log.fold('foo\nbar\nbaz');
      var result =
        '<p><a href="#!travis-ci/travis-ci/L1" name="#!travis-ci/travis-ci/L1">1</a>foo</p>\n' +
        '<p><a href="#!travis-ci/travis-ci/L2" name="#!travis-ci/travis-ci/L2">2</a>bar</p>\n' +
        '<p><a href="#!travis-ci/travis-ci/L3" name="#!travis-ci/travis-ci/L3">3</a>baz</p>'

      expect(Travis.Log.numberLines(source)).toEqual(result);
    });
  });

  describe('foldLog', function() {
    it('wraps the matched section into a div', function() {
      var source = '$ foo\n$ bundle install\nUsing a\nUsing b\nYour bundle is complete! Use `bundle show [gemname]`.';
      var result = '$ foo\n<div class="fold bundle">$ bundle install\nUsing a\nUsing b</div>Your bundle is complete! Use `bundle show [gemname]`.'
      expect(Travis.Log.fold(source)).toEqual(result);
    });
  });

  describe('unfoldLog', function() {
    it('unfolds the log', function() {
      var source = '$ foo\n<div class="fold bundle">$ bundle install</div>Your bundle is complete!<div class="fold bundle">$ bundle install</div>Your bundle is complete!';
      var result = '$ foo\n$ bundle install\nYour bundle is complete!$ bundle install\nYour bundle is complete!';
      expect(Travis.Log.unfold(source)).toEqual(result);
    });
  });
});
