require 'statistics'

class StatisticsController < ApplicationController
  layout 'simple'

  def index
    @repo_graph_stats = Statistics.daily_repository_counts
    @test_graph_stats = Statistics.daily_tests_counts
  end
end
