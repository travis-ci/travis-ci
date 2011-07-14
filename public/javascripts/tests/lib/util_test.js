String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
}

describe('Utils', function() {
  describe('PathHelpers', function(){
    it('should return repository path with line number', function() {
      expect(Utils.PathHelpers.repositoryPath('owner', 'name', 'line_number'))
        .toEqual("#!/owner/name/Lline_number")
    })
    it('should return repository path without line number', function() {
      expect(Utils.PathHelpers.repositoryPath('owner', 'name'))
        .toEqual("#!/owner/name")
    })
    it('should return repository build path with line number', function() {
      expect(Utils.PathHelpers.repositoryBuildPath('owner', 'name', 'build_id', 'line_number'))
        .toEqual("#!/owner/name/builds/build_id/Lline_number")
    })
    it('should return repository build path without line number', function() {
      expect(Utils.PathHelpers.repositoryBuildPath('owner', 'name', 'build_id'))
        .toEqual("#!/owner/name/builds/build_id")
    })
  })

  describe('stripPaths', function() {
    it('removes the path to the build directory in /tmp', function() {
      var source = 'foo\n/tmp/travis/builds/svenfuchs/rails/activesupport/lib/active_support/core_ext/hash/slice.rb:15';
      var result = 'foo\nactivesupport/lib/active_support/core_ext/hash/slice.rb:15'
      expect(Utils.stripPaths(source)).toEqual(result);
    });
  });

  describe('escapeRuby', function() {
    it('escapes ruby style object output', function() {
      var source = '#<Object:0x00000005fb3628>';
      var result = '#&lt;Object:0x00000005fb3628&gt;';
      expect(Utils.escapeRuby(source)).toEqual(result);
    });
  });

    var fold = function(string) {
      return Utils.foldLog(Utils.foldLog(string));
    }

  describe('foldLog', function() {
    it('folds the "$ bundle install" portion of the log', function() {
      var examples = [
        [ '$ foo\n$ bundle install\n',
          '$ foo\n\n<div class="fold bundle">\n$ bundle install</div>\n' ],

        [ '$ foo\n$ bundle install\nUsing a\nFetching b\n',
          '$ foo\n\n<div class="fold bundle">\n$ bundle install\nUsing a\nFetching b</div>\n' ],

        [ '$ foo\n$ bundle install\nUsing a\nUsing b\nYour bundle is complete! Use `bundle show [gemname]`.',
          '$ foo\n\n<div class="fold bundle">\n$ bundle install\nUsing a\nUsing b</div>\nYour bundle is complete! Use `bundle show [gemname]`.' ],
      ];
      _.each(examples, function(example) {
        expect(fold(example[0])).toEqual(example[1]);
      });
    });

    it('folds the executing ruby line output by rake', function() {
      var source = '/home/vagrant/.rvm/rubies/ruby-1.8.7-p334/bin/ruby -I"lib:lib:test" "/home/vagrant/.rvm/gems/rbx-head/gems/rake-0.8.7/lib/rake/rake_test_loader.rb" "test/a.rb" "test/b.rb" \nLoaded suite ...';
      var result = '\n<div class="fold exec">\n/home/vagrant/.rvm/rubies/ruby-1.8.7-p334/bin/ruby -I"lib:lib:test" "/home/vagrant/.rvm/gems/rbx-head/gems/rake-0.8.7/lib/rake/rake_test_loader.rb" "test/a.rb" "test/b.rb"</div>\n\nLoaded suite ...';
      expect(fold(source)).toEqual(result);
    });

    it('does not fold other lines starting with a path to the rvm ruby dir', function() {
      var source = "/home/vagrant/.rvm/rubies/ruby-1.8.7-p334/lib/ruby/site_ruby/1.8/rubygems/spec_fetcher.rb:133:in `load': marshal data too short (ArgumentError)\r\n";
      var result = "/home/vagrant/.rvm/rubies/ruby-1.8.7-p334/lib/ruby/site_ruby/1.8/rubygems/spec_fetcher.rb:133:in `load': marshal data too short (ArgumentError)\r\n";
      expect(fold(source)).toEqual(result);
    });

    it('folds the "$ rake db:migrate" portion of the log', function() {
      var tests = [
        [ '$ rake db:migrate && rake test\n'                                                    +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================\n\n',

          '\n<div class="fold migrate">\n$ rake db:migrate && rake test\n'                          +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================</div>\n'],

        [ '$ rake db:migrate && rake test\n'                                                    +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================\n\n' +
          '==  CreateBuilds: migrating ===================================================\n'   +
          '-- create_table(:builds)\n'                                                          +
          '   -> 0.0019s\n'                                                                     +
          '==  CreateBuilds: migrated (0.0019s) ==========================================\n\n',

          '\n<div class="fold migrate">\n$ rake db:migrate && rake test\n'                          +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================\n\n' +
          '==  CreateBuilds: migrating ===================================================\n'   +
          '-- create_table(:builds)\n'                                                          +
          '   -> 0.0019s\n'                                                                     +
          '==  CreateBuilds: migrated (0.0019s) ==========================================</div>\n' ],
      ]
      _.each(tests, function(test) {
        expect(fold(test[0])).toEqual(test[1]);
      });
    });

    it('folds the log', function() {
      var log = jasmine.getFixture('log/unfolded.html');
      var expected = jasmine.getFixture('log/folded.html');
      expect(fold(log)).toEqual(expected);
    });

    // it('wraps lines without inserting duplicate linebreaks on multiple runs', function() {
    //   var log = '.'.repeat(380);
    //   var folded = '.'.repeat(120) + "\n" + '.'.repeat(120) + "\n" + '.'.repeat(120) + "\n" + '.'.repeat(20)
    //   log = Utils.foldLog(log)
    //   log = Utils.foldLog(log)
    //   log = Utils.foldLog(log)
    //   log = Utils.foldLog(log)
    //   expect(log).toEqual(folded);
    // });
  });

  describe('unfoldLog', function() {
    it('unfolds the log', function() {
      var tests = [
        [ '$ foo\n<div class="fold bundle">$ bundle install</div>',
          '$ foo\n$ bundle install\n' ],

        [ '$ foo\n<div class="fold bundle">$ bundle install\nUsing a\nUsing b</div>',
          '$ foo\n$ bundle install\nUsing a\nUsing b\n' ],

        [ '$ foo\n<div class="fold bundle">$ bundle install\nUsing a\nUsing b</div>Your bundle is complete! Use `bundle show [gemname]`.',
          '$ foo\n$ bundle install\nUsing a\nUsing b\nYour bundle is complete! Use `bundle show [gemname]`.' ],

        [ '$ foo\n<div class="fold bundle">$ bundle install</div>Your bundle is complete!<div class="fold bundle">$ bundle install</div>Your bundle is complete!',
          '$ foo\n$ bundle install\nYour bundle is complete!$ bundle install\nYour bundle is complete!' ],
      ]
      _.each(tests, function(test) {
        expect(Utils.unfoldLog(test[0])).toEqual(test[1]);
      });
    });
  });
});
''

