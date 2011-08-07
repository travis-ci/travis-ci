require 'spec_helper'

describe Travis::Renderer do
  before do
    Travis::Renderer.send(:public, :template_path)
  end

  after do
    Travis::Renderer.send(:protected, :template_path)
  end

  let(:build) { Factory(:build) }

  describe 'rendering' do
    before do
      Travis::Renderer.any_instance.stubs(:template).returns('attributes :id')
    end

    it 'given a model hash returns a Hash' do
      Travis.hash(build).should == { :id => build.id }
    end

    it 'given a model json returns a JSON String' do
      JSON.parse(Travis.json(build)).should == { 'id' => build.id }
    end

    it 'given a Hash hash returns a Hash containing Hashes' do
      Travis.hash(:repository => build.repository, :build => build).should == { :repository => { :id => build.id }, :build => { :id => build.id } }
    end
  end

  describe 'template_path' do
    def template_path(*args)
      renderer = Travis::Renderer.new(:json, build, *args)
      renderer.template_path(renderer.type)
    end

    it "uses :v1 as a default version, :default as a default type and derives the template name from the model's class" do
      template_path.should == 'app/views/v1/default/build.rabl'
    end

    it "allows to specify a version" do
      template_path(:version => :v2).should == 'app/views/v2/default/build.rabl'
    end

    it "allows to specify a type" do
      template_path(:type => :events).should == 'app/views/v1/events/build.rabl'
    end

    it "allows to specify a template name" do
      template_path(:template => 'foo/bar').should == 'app/views/v1/default/foo/bar.rabl'
    end
  end
end
