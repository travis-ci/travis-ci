require 'spec_helper'

describe Repository do
  describe 'validates' do
    it 'uniqueness of :owner_name/:name' do
      existing = Factory(:repository)
      repository = Repository.new(existing.attributes)
      repository.should_not be_valid
      repository.errors['name'].should == ['has already been taken']
    end
  end

  describe 'class methods' do
    describe 'find_by_params' do
      let(:minimal) { Factory(:repository) }

      it "should find a repository by it's id" do
        Repository.find_by_params(:id => minimal.id).id.should == minimal.id
      end

      it "should find a repository by it's name and owner_name" do
        repository = Repository.find_by_params(:name => minimal.name, :owner_name => minimal.owner_name)
        repository.owner_name.should == minimal.owner_name
        repository.name.should == minimal.name
      end
    end

    describe 'timeline' do
      it 'sorts the most repository with the most recent build to the top' do
        repository_1 = Factory(:repository, :name => 'repository_1', :last_build_started_at => '2011-11-11')
        repository_2 = Factory(:repository, :name => 'repository_2', :last_build_started_at => '2011-11-12')

        repositories = Repository.timeline.all
        repositories.first.id.should == repository_2.id
        repositories.last.id.should == repository_1.id
      end
    end

    describe 'search' do
      it 'performs searches case-insensitive' do
        repository_1 = Factory(:repository, :name => 'repository_1', :last_build_started_at => '2011-11-11')
        repository_2 = Factory(:repository, :name => 'repository_2', :last_build_started_at => '2011-11-12')

        assert_equal 2, Repository.search('ePoS').count
      end
    end
  end

  it 'last_build returns the most recent build' do
    repository = Factory(:repository)
    attributes = { :repository => repository, :state => 'finished' }
    Factory(:build, attributes)
    Factory(:build, attributes)
    build = Factory(:build, attributes)

    repository.last_build.id.should == build.id
  end

  describe 'last_build_status' do
    let(:build)      { Factory(:build, :state => 'finished', :config => { 'rvm' => ['1.8.7', '1.9.2'], 'env' => ['DB=sqlite3', 'DB=postgresql'] }) }
    let(:repository) { build.repository }

    it 'returns the last_build_status attribute if no params have been passed' do
      repository.update_attributes(:last_build_status => 0)
      repository.reload.last_build_status.should == 0
    end

    it 'returns 0 (passing) if all specified builds are passing' do
      build.matrix.each { |task| task.update_attribute(:status, task.config[:rvm] == '1.8.7' ? 0 : 1) }
      assert_equal 0, repository.last_build_status('rvm' => '1.8.7')
    end

    it 'returns 1 (failing) if at least one specified build is failing' do
      build.matrix.each_with_index { |build, ix| build.update_attribute(:status, ix == 0 ? 1 : 0) }
      assert_equal 1, repository.last_build_status('rvm' => '1.8.7')
    end

    it 'returns nil when the hash is invalid' do
      assert_equal nil, repository.last_build_status('foo' => 'bar')
    end
  end
end

