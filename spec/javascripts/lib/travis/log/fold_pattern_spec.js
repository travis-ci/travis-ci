describe("Travis.Log", function() {
  describe('the fold pattern', function() {
    describe('for bundle install', function() {
      it('matches with single line breaks', function() {
        var log = '$ bundle install\n' +
                  'Fetching source index for http://rubygems.org/\n' +
                  'Using rake (0.9.2)\n' +
                  'Installing rcov (0.9.9) with native extensions WARNING: rcov-0.9.9 has an invalid nil value for @cert_chain\n\n' +
                  'Using diaspora-client (0.1.0) from git://github.com/diaspora/diaspora-client.git (at master)\n' +
                  'foo\nbar';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['bundle']);
      });

      it('matches with multiple line breaks', function() {
        var log = '$ bundle install\n' +
                  'Fetching source index for http://rubygems.org/\n\n' +
                  'Using rake (0.9.2)\n\n' +
                  'Installing rcov (0.9.9) with native extensions WARNING: rcov-0.9.9 has an invalid nil value for @cert_chain\n\n' +
                  'Using diaspora-client (0.1.0) from git://github.com/diaspora/diaspora-client.git (at master)\n\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['bundle']);
      });
    });

    describe('for rake db:migrate', function() {
      it('matches with bundle exec prepended', function() {
        var log = '$ bundle exec rake db:create db:migrate test\n' +
                  '==  CreateSettings: migrating =================================================\n' +
                  '-- create_table(:settings)\n' +
                  '   -> 0.0016s\n' +
                  '==  CreateSettings: migrated (0.0017s) ========================================\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['migrate']);
      });

      it('matches with single line breaks', function() {
        var log = '$ rake db:create db:migrate test\n' +
                  '==  CreateSections: migrating =================================================\n' +
                  '-- create_table(:sections)\n' +
                  '   -> 0.0010s\n' +
                  '-- add_index(:sections, :main_section_id)\n' +
                  '   -> 0.0004s\n' +
                  '==  CreateSections: migrated (0.0016s) ========================================\n\n' +
                  '==  CreateSettings: migrating =================================================\n' +
                  '-- create_table(:settings)\n' +
                  '   -> 0.0016s\n' +
                  '==  CreateSettings: migrated (0.0017s) ========================================\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['migrate']);
      });

      it('matches with multiple line breaks', function() {
        var log = '$ rake db:create db:migrate test\n\n' +
                  '==  CreateSections: migrating =================================================\n\n' +
                  '-- create_table(:sections)\n\n' +
                  '   -> 0.0010s\n\n' +
                  '-- add_index(:sections, :main_section_id)\n\n' +
                  '   -> 0.0004s\n\n' +
                  '==  CreateSections: migrated (0.0016s) ========================================\n\n\n\n' +
                  '==  CreateSettings: migrating =================================================\n\n' +
                  '-- create_table(:settings)\n\n' +
                  '   -> 0.0016s\n\n' +
                  '==  CreateSettings: migrated (0.0017s) ========================================\n\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['migrate']);
      });
    });

    describe('for rake schema:load', function() {
      it('matches with bundle exec prepended', function() {
        var log = '$ bundle exec rake db:schema:load\n' +
                  '-- create_table("aspect_memberships", {:force=>true})\n' +
                  '   -> 0.2026s\n' +
                  '-- add_index("aspect_memberships", ["aspect_id"], {:name=>"index_aspect_memberships_on_aspect_id"})\n' +
                  '   -> 0.0444s\n' +
                  '-- assume_migrated_upto_version(20110830170929, "db/migrate")\n' +
                  '   -> 0.0444s\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['schema']);
      });

      it('matches with single line breaks', function() {
        var log = '$ rake db:schema:load\n' +
                  '-- create_table("aspect_memberships", {:force=>true})\n' +
                  '   -> 0.2026s\n' +
                  '-- add_index("aspect_memberships", ["aspect_id"], {:name=>"index_aspect_memberships_on_aspect_id"})\n' +
                  '   -> 0.0444s\n' +
                  '-- assume_migrated_upto_version(20110830170929, "db/migrate")\n' +
                  '   -> 0.0444s\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['schema']);
      });

      it('matches with multiple line breaks', function() {
        var log = '$ rake db:schema:load\n\n' +
                  '-- create_table("aspect_memberships", {:force=>true})\n\n' +
                  '   -> 0.2026s\n\n' +
                  '-- add_index("aspect_memberships", ["aspect_id"], {:name=>"index_aspect_memberships_on_aspect_id"})\n\n' +
                  '   -> 0.0444s\n' +
                  '-- assume_migrated_upto_version(20110830170929, "db/migrate")\n' +
                  '   -> 0.0444s\n';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['schema']);
      });
    });

    describe('for executing ruby lines', function() {
      it('matches lines like output by rake', function() {
        var log = '/home/vagrant/.rvm/rubies/ree-1.8.7-2011.03/bin/ruby -S bundle exec rspec ./spec/controllers/aspect_memberships_controller_spec.rb ./spec/controllers/activity_streams/photos_controller_spec.rb';

        expect(Travis.Log.numberLines(log)).toMatch(Travis.Log.FOLDS['exec']);
      });

      it('does not match other lines starting with a path to the rvm ruby dir', function() {
        var log = "/home/vagrant/.rvm/rubies/ruby-1.8.7-p334/lib/ruby/site_ruby/1.8/rubygems/spec_fetcher.rb:133:in `load': marshal data too short (ArgumentError)\r\n";

        expect(Travis.Log.numberLines(log)).not.toMatch(Travis.Log.FOLDS['exec']);
      });
    });
  });
});
