module Scenario
  class << self
    def default
      minimal, enginex = repositories :minimal, :enginex

      build :repository => minimal,
            :number => 1,
            :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
            :status => 1,
            :state  => 'finished',
            :started_at => '2010-11-12 12:00:00',
            :finished_at => '2010-11-12 12:00:10',
            :commit => {
              :commit => '1a738d9d6f297c105ae2',
              :ref => 'refs/heads/develop',
              :branch => 'master',
              :message => 'add Gemfile',
              :committer_name => 'Sven Fuchs',
              :committer_email => 'svenfuchs@artweb-design.de',
              :committed_at => '2010-11-12 11:50:00',
            },
            :jobs => [
              { :log => Artifact::Log.new(:content => 'minimal log 1'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' }
            ]

      build :repository => minimal,
            :number => 2,
            :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
            :status => 0,
            :state  => 'finished',
            :started_at => '2010-11-12 12:30:00',
            :finished_at => '2010-11-12 12:30:20',
            :commit => {
              :commit => '91d1b7b2a310131fe3f8',
              :ref => 'refs/heads/master',
              :branch => 'master',
              :message => 'Bump to 0.0.22',
              :committer_name => 'Sven Fuchs',
              :committer_email => 'svenfuchs@artweb-design.de',
              :committed_at => '2010-11-12 12:25:00',
            },
            :jobs => [
              { :log => Artifact::Log.new(:content => 'minimal log 2'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' }
            ]

      build :repository => minimal,
            :number => '3',
            :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
            :status => '',
            :state  => 'configured',
            :started_at => '2010-11-12 13:00:00',
            :finished_at => nil,
            :commit => {
              :commit => 'add057e66c3e1d59ef1f',
              :ref => 'refs/heads/master',
              :branch => 'master',
              :message => 'unignore Gemfile.lock',
              :committed_at => '2010-11-12 12:55:00',
              :committer_name => 'Sven Fuchs',
              :committer_email => 'svenfuchs@artweb-design.de',
            },
            :jobs => [
              { :log => Artifact::Log.new(:content => 'minimal log 3.1'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' },
              { :log => Artifact::Log.new(:content => 'minimal log 3.2'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' },
              { :log => Artifact::Log.new(:content => 'minimal log 3.3'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' },
              { :log => Artifact::Log.new(:content => 'minimal log 3.4'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' }
            ]

      build :repository => enginex,
            :number => 1,
            :status => 1,
            :state  => 'finished',
            :started_at => '2010-11-11 12:00:00',
            :finished_at => '2010-11-11 12:00:05',
            :commit => {
              :commit => '565294c05913cfc23230',
              :branch => 'master',
              :ref => 'refs/heads/master',
              :message => 'Update Capybara',
              :author_name => 'Jose Valim',
              :author_email => 'jose@email.com',
              :committer_name => 'Jose Valim',
              :committer_email => 'jose@email.com',
              :committed_at => '2010-11-11 11:55:00',
            },
            :jobs => [
              { :log => Artifact::Log.new(:content => 'enginex log 1'), :worker => 'ruby3.worker.travis-ci.org:travis-ruby-4' }
            ]

      [minimal, enginex]
    end

    def repositories(*names)
      names.map { |name| Factory(name) }
    end

    def build(attributes)
      commit = attributes.delete(:commit)
      jobs  = attributes.delete(:jobs)
      commit = Factory(:commit, commit)

      build  = Factory(:build, attributes.merge(:commit => commit))
      build.matrix.each_with_index do |job, ix|
        job.update_attributes!(jobs[ix])
      end

      if build.finished?
        keys = %w(id number status finished_at started_at)
        attributes = keys.inject({}) { |result, key| result.merge(:"last_build_#{key}" => build.send(key)) }
        build.repository.update_attributes!(attributes)
      end
    end
  end
end
