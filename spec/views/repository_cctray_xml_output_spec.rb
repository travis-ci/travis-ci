# -*- coding: utf-8 -*-
require 'spec_helper'

describe "repositories/show.cctray.xml.builder" do
  
  let(:rendered_xml) { ActiveSupport::XmlMini.parse(rendered) }
  
  it "renders the basic details of a repository" do
    assign(:repository, stub_model(Repository, :id => 1, 
      :name => "travisci", 
      :url => "http://travis-ci.org",
      :last_build_number => 123
    ))
    render
    rendered_xml.should have_attribute("name", "travisci").for_node_path(%w{Projects Project})
    rendered_xml.should have_attribute("webUrl", "http://travis-ci.org").for_node_path(%w{Projects Project})
    rendered_xml.should have_attribute("lastBuildLabel", "123").for_node_path(%w{Projects Project})
  end
  
  it "renders the correct status for a repository with no running build" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build => stub_model(Build, :started? => true, :finished? => true)))
    render
    rendered_xml.should have_attribute("activity", "Sleeping").for_node_path(%w{Projects Project})
  end
  
  it "renders the last build time in the correct format" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build_finished_at => DateTime.parse("05 Aug 2011 12:15:34 +0000")))
    render
    rendered_xml.should have_attribute("lastBuildTime", "2011-08-05T12:15:34.000+0000").for_node_path(%w{Projects Project})
  end
  
  it "renders the correct activity status for a repository with a running build" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build => stub_model(Build, :started? => true, :finished? => false)))
    render
    rendered_xml.should have_attribute("activity", "Building").for_node_path(%w{Projects Project})
  end
  
  it "renders the correct activity status for a repository with no builds" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build => nil))
    render
    rendered_xml.should have_attribute("activity", "Sleeping").for_node_path(%w{Projects Project})
  end
  
  it "renders the correct build status for a repository whose last build failed" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build_status => 1))
    render
    rendered_xml.should have_attribute("lastBuildStatus", "Failure").for_node_path(%w{Projects Project})
  end
  
  it "renders the correct build status for a repository whose last build passed" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build_status => 0))
    render
    rendered_xml.should have_attribute("lastBuildStatus", "Success").for_node_path(%w{Projects Project})
  end
  
  it "renders the correct build status for a repository whose last build has an unknown status" do
    assign(:repository, stub_model(Repository, :id => 1, :last_build_status => -1))
    render
    rendered_xml.should have_attribute("lastBuildStatus", "Unknown").for_node_path(%w{Projects Project})
  end
  
end

RSpec::Matchers.define :have_attribute do |key, value|
  match do |actual|
    node = find_node(actual, @node_path)
    node && (node[key] == value)
  end
  
  chain :for_node_path do |node_path_array|
    @node_path = node_path_array
  end
  
  failure_message_for_should do |actual|
    node = find_node(actual, @node_path)
    "expected rendered XML would have attribute '#{key}' with value of '#{value}', but was #{node ? node[key] : nil}"
  end
  
  def find_node(root, node_path)
    node_path.inject(root) { |value, node| value ? value[node] : nil }
  end
end
