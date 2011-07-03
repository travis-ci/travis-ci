require 'statistics'

class StatisticsController < ApplicationController
  layout 'simple'

  def index
    @repo_graph_stats  = Statistics.daily_repository_counts
    @build_graph_stats = Statistics.daily_build_counts
  end

end