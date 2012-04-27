module Travis
  module Api
    module Json
      module Http
        class Workers
          attr_reader :workers

          def initialize(workers, options = {})
            @workers = workers
          end

          def data
            workers.map { |worker| worker_data(worker) }
          end

          def worker_data(worker)
            {
              'id' => worker.id,
              'name' => worker.name,
              'host' => worker.host,
              'state' => worker.state.to_s,
              'last_seen_at' => worker.last_seen_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'payload' => worker.payload,
              'last_error' => worker.last_error
            }
          end
        end
      end
    end
  end
end
