module Travis
  module Api
    module Json
      module Http
        module Job
          class Tests
            attr_reader :jobs

            def initialize(jobs, options = {})
              @jobs = jobs
            end

            def data
              jobs.map { |job| job_data(job) }
            end

            def job_data(job)
              commit = job.commit
              {
                'id' => job.id,
                'repository_id' => job.repository_id,
                'number' => job.number,
                'state' => job.state,
                'queue' => job.queue,
                'allow_failure' => job.allow_failure
              }
            end
          end
        end
      end
    end
  end
end
