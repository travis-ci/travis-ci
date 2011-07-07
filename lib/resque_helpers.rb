module ResqueHelpers
  class << self
    def queued_jobs(queue = :builds)
      Resque.peek(queue, 0, 50).map do |job|
        data = job['args'].last
        build = data['build'].slice('id', 'number', 'commit')
        repository = data['repository'].slice('id', 'slug')
        build.merge('repository' => repository)
      end
    end

    def active_workers
      Resque.workers.map { |worker| { :id => worker.to_s } }.compact
    end
  end
end
