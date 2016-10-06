String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
}

describe('Utils', function() {
  var fold = function(string) {
    return Utils.foldLog(Utils.foldLog(string));
  }

  describe('foldLog', function() {
    it('folds the "$ bundle install" portion of the log', function() {
      var tests = [
        [ '$ foo\n$ bundle install\n',
          '$ foo\n<div class="fold">$ bundle install</div>' ],

        [ '$ foo\n$ bundle install\nUsing a\nUsing b\n',
          '$ foo\n<div class="fold">$ bundle install\nUsing a\nUsing b</div>' ],

        [ '$ foo\n$ bundle install\nUsing a\nUsing b\nYour bundle is complete! Use `bundle show [gemname]`.',
          '$ foo\n<div class="fold">$ bundle install\nUsing a\nUsing b</div>Your bundle is complete! Use `bundle show [gemname]`.' ],
      ]
      _.each(tests, function(test) {
        expect(fold(test[0])).toEqual(test[1]);
      });
    });

    it('folds the "$ rake db:migrate" portion of the log', function() {
      var tests = [
        [ '$ rake db:migrate && rake test\n'                                                    +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================\n\n',

          '<div class="fold">$ rake db:migrate && rake test\n'                                  +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================</div>'],

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

          '<div class="fold">$ rake db:migrate && rake test\n'                                  +
          '(in /tmp/travis/builds/travis_ci/travis-ci)\n'                                       +
          '==  CreateRepositories: migrating =============================================\n'   +
          '-- create_table(:repositories)\n'                                                    +
          '   -> 0.0009s\n'                                                                     +
          '==  CreateRepositories: migrated (0.0009s) ====================================\n\n' +
          '==  CreateBuilds: migrating ===================================================\n'   +
          '-- create_table(:builds)\n'                                                          +
          '   -> 0.0019s\n'                                                                     +
          '==  CreateBuilds: migrated (0.0019s) ==========================================</div>' ],
      ]
      _.each(tests, function(test) {
        expect(fold(test[0])).toEqual(test[1]);
      });
    });

    it('folds a rake db:migrate section in a de-ansi-ed log', function() {
      var log =
        'Using yajl-ruby (0.8.1) \n' +
        '[32mYour bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.[0m\n' +
        '$ rake db:migrate && rake test\n' +
        '(in /tmp/travis/builds/travis_ci/travis-ci)\n' +
        '==  CreateRepositories: migrating =============================================\n' +
        '-- create_table(:repositories)\n' +
        '   -> 0.0009s\n' +
        '==  CreateRepositories: migrated (0.0009s) ====================================\n' +
        '\n' +
        '==  CreateBuilds: migrating ===================================================\n' +
        '-- create_table(:builds)\n' +
        '   -> 0.0019s\n' +
        '==  CreateBuilds: migrated (0.0019s) ==========================================\n' +
        '\n' +
        '==  DeviseCreateUsers: migrating ==============================================\n' +
        '-- create_table(:users)\n' +
        '   -> 0.0008s\n' +
        '-- add_index(:users, :login, {:unique=>true})\n' +
        '   -> 0.0004s\n' +
        '==  DeviseCreateUsers: migrated (0.0014s) =====================================\n' +
        '\n' +
        '==  RepositoriesAddUsername: migrating ========================================\n' +
        '-- change_table(:repositories)\n' +
        '   -> 0.0005s\n' +
        '==  RepositoriesAddUsername: migrated (0.0005s) ===============================\n' +
        '\n' +
        '==  CreateTokens: migrating ===================================================\n' +
        '-- create_table(:tokens)\n' +
        '   -> 0.0008s\n' +
        '==  CreateTokens: migrated (0.0008s) ==========================================\n' +
        '\n' +
        '==  AddBuildParentIdAndConfiguration: migrating ===============================\n' +
        '-- change_table(:builds)\n' +
        '   -> 0.0008s\n' +
        '-- change_column(:builds, :number, :string)\n' +
        '   -> 0.0088s\n' +
        '-- add_index(:builds, :repository_id)\n' +
        '   -> 0.0004s\n' +
        '-- add_index(:builds, :parent_id)\n' +
        '   -> 0.0005s\n' +
        '==  AddBuildParentIdAndConfiguration: migrated (0.0107s) ======================\n' +
        '\n' +
        'Jammit Warning: Asset compression disabled -- Java unavailable.\n';

      actual = fold(Utils.deansi(log));
      expect(actual.indexOf('<span class="green">Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.</span>')).not.toEqual(-1);
      expect(actual.indexOf('<div class="fold">$ rake db:migrate && rake test')).not.toEqual(-1);
      expect(actual.indexOf('==  AddBuildParentIdAndConfiguration: migrated (0.0107s) ======================</div>')).not.toEqual(-1);
    });

    it('folds the log', function() {
      var log = jasmine.getFixture('log/unfolded.html');
      var expected = jasmine.getFixture('log/folded.html');
      expect(fold(log)).toEqual(expected);
    });

    it('wraps lines without inserting duplicate linebreaks on multiple runs', function() {
      var log = '.'.repeat(380);
      var folded = '.'.repeat(120) + "\n" + '.'.repeat(120) + "\n" + '.'.repeat(120) + "\n" + '.'.repeat(20)
      log = Utils.foldLog(log)
      log = Utils.foldLog(log)
      log = Utils.foldLog(log)
      log = Utils.foldLog(log)
      expect(log).toEqual(folded);
    });
  });

  describe('unfoldLog', function() {
    it('unfolds the log', function() {
      var tests = [
        [ '$ foo\n<div class="fold">$ bundle install</div>',
          '$ foo\n$ bundle install\n' ],

        [ '$ foo\n<div class="fold">$ bundle install\nUsing a\nUsing b</div>',
          '$ foo\n$ bundle install\nUsing a\nUsing b\n' ],

        [ '$ foo\n<div class="fold">$ bundle install\nUsing a\nUsing b</div>Your bundle is complete! Use `bundle show [gemname]`.',
          '$ foo\n$ bundle install\nUsing a\nUsing b\nYour bundle is complete! Use `bundle show [gemname]`.' ],

        [ '$ foo\n<div class="fold">$ bundle install</div>Your bundle is complete!<div class="fold">$ bundle install</div>Your bundle is complete!',
          '$ foo\n$ bundle install\nYour bundle is complete!$ bundle install\nYour bundle is complete!' ],
      ]
      _.each(tests, function(test) {
        expect(Utils.unfoldLog(test[0])).toEqual(test[1]);
      });
    });
  });
});
''

