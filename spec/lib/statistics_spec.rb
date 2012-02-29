require 'spec_helper'

describe Statistics do
  before { Scenario.default }
  let(:today) {Date.today.to_s(:date)}

  describe "when listing daily test counts" do
    it "should return the jobs per day" do
      daily_stats = Statistics.daily_tests_counts
      daily_stats.should have(1).item
      daily_stats.first[:date].should == today
      daily_stats.first[:run_on_date].should == 13
    end
  end

  describe "when listing total repositories" do
    it "should return the number per day" do
      repositories = Statistics.daily_repository_counts
      repositories.should have(2).items
      repositories.second[:date].should == today
      repositories.second[:added_on_date].should == 1
    end

    it "should include the total growth" do
      repositories = Statistics.daily_repository_counts
      repositories.should have(2).items
      repositories.second[:date].should == today
      repositories.second[:total_growth].should == 2
    end
  end
end
