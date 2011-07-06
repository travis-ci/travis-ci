module ResqueHelpers

  class << self
    def queued_jobs
      [:builds, :rails].each do |queue|
        Resque.peek(queue, 0, 50).map do |job|
          job['args'].last.tap do |data|
            data['repository'].slice!('id', 'slug')
            data.update(data['build'].slice('id', 'number', 'commit'))
            data.delete('build')
          end
        end.flatten
      end
    end

    def active_workers
      Resque.workers.map { |worker| { :id => worker.to_s } }.compact
    end
  end

end
