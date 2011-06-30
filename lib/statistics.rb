class Statistics

  class << self
    def daily_repository_counts
      repos = Repository.
                select(['date(created_at) AS created_at_date', 'count(created_at) AS repository_count']).
                group('created_at_date').
                order('created_at_date')

      repo_totals = 0

      repos.map do |r|
        {
          :date => r.created_at_date,
          :added_on_date => r.repository_count.to_i,
          :total_growth => repo_totals += r.repository_count.to_i
        }
      end
    end
  end

end