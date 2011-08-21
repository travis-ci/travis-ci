# encoding: utf-8
# truncate all tables for test and development

# TODO: This is the wrong place for seed data, for now
#       it has been commented out, but this needs a new home
if Rails.env.development? || Rails.env.jasmine?

  minimal = Repository.create!({
    :owner_name => 'svenfuchs',
    :name => 'minimal',
    :url => 'https://github.com/svenfuchs/minimal',
    :last_duration => 10
  })

  Build.create!({
    :repository => minimal,
    :number => 1,
    :status => 1,
    :commit => '1a738d9d6f297c105ae2',
    :ref => 'refs/heads/develop',
    :branch => 'master',
    :message => 'add Gemfile',
    :committed_at => '2010-11-12 11:58:00',
    :committer_name => 'Sven Fuchs',
    :committer_email => 'svenfuchs@artweb-design.de',
    :started_at => '2010-11-12 12:00:00',
    :finished_at => '2010-11-12 12:00:08',
    :agent => '76f4f2ba',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.log")
  })

  Build.create!({
    :repository => minimal,
    :number => 2,
    :status => 0,
    :commit => '91d1b7b2a310131fe3f8',
    :ref => 'refs/heads/master',
    :branch => 'master',
    :message => 'Bump to 0.0.22',
    :committed_at => '2010-11-12 12:28:00',
    :committer_name => 'Sven Fuchs',
    :committer_email => 'svenfuchs@artweb-design.de',
    :started_at => '2010-11-12 12:30:00',
    :finished_at => '2010-11-12 12:30:08',
    :agent => 'a1732e4f',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.2.log")
  })

  Build.create!(
    :number => '3',
    :repository => minimal,
    :status => '',
    :commit => 'add057e66c3e1d59ef1f',
    :ref => 'refs/heads/master',
    :branch => 'master',
    :message => 'unignore Gemfile.lock',
    :committed_at => '2010-11-12 12:58:00',
    :committer_name => 'Sven Fuchs',
    :committer_email => 'svenfuchs@artweb-design.de',
    :started_at => '2010-11-12 13:00:00',
    :agent => '76f4f2ba',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.log"),
    :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] }
  )

  enginex = Repository.create!({
    :owner_name => 'josevalim',
    :name => 'enginex',
    :url => 'https://github.com/josevalim/enginex',
    :last_duration => 30
  })

  Build.create!({
    :repository => enginex,
    :number => 1,
    :status => 1,
    :commit => '565294c05913cfc23230',
    :message => 'Update Capybara',
    :committed_at => '2010-11-11 11:58:00',
    :author_name => 'Jose Valim',
    :author_email => 'jose@email.com',
    :committer_name => 'Jose Valim',
    :committer_email => 'jose@email.com',
    :started_at => '2010-11-11 12:00:00',
    :finished_at => '2010-11-11 12:00:20',
    :agent => 'a1732e4f',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.2.log")
  })


  rails_admin = Repository.create!({
    :owner_name => 'sferik',
    :name => 'rails_admin',
    :url => 'https://github.com/sferik/rails_admin',
    :last_duration => 30
  })

  Build.create!({
    :repository => rails_admin,
    :branch => 'master',
    :number => 1,
    :status => 0,
    :commit => '565294c05913cfc232300',
    :message => 'fixes to API',
    :committed_at => '2010-11-11 11:58:00',
    :author_name => 'Erik Michaels-Ober',
    :author_email => 'sferik@email.com',
    :committer_name => 'Erik Michaels-Ober',
    :committer_email => 'sferik@email.com',
    :started_at => '2010-11-11 12:00:00',
    :finished_at => '2011-08-09 12:00:20',
    :agent => 'a1732e4d',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.2.log"),
    :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] }
  })

  Build.create!({
    :repository => rails_admin,
    :branch => 'dev',
    :number => 2,
    :status => 0,
    :commit => '565294c05913cfc232301',
    :message => 'more fixes to API',
    :committed_at => '2011-08-08 11:58:00',
    :author_name => 'Erik Michaels-Ober',
    :author_email => 'sferik@email.com',
    :committer_name => 'Erik Michaels-Ober',
    :committer_email => 'sferik@email.com',
    :started_at => '2011-08-09 12:10:00',
    :finished_at => '2011-08-09 12:10:20',
    :agent => 'a1732e4d',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.2.log"),
    :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] }
  })
end
