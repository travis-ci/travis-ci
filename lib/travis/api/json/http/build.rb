module Travis
  module Api
    module Json
      module Http
        class Build
          class Job
            attr_reader :job, :commit

            def initialize(job)
              @job = job
              @commit = job.commit
            end

            def data
              {
                'id' => job.id,
                'number' => job.number,
                'config' => job.config,
                'started_at' => job.started_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'finished_at' => job.finished_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'log' => job.log.content
              }
            end
          end

          attr_reader :build, :commit, :request, :repository

          def initialize(build)
            @build = build
            @commit = build.commit
            @request = build.request
            @repository = build.repository
          end

          def data
            {
              'id' => build.id,
              'repository_id' => repository.id,
              'number' => build.number,
              'config' => build.config.stringify_keys,
              'state' => build.state,
              'result' => build.status,
              'status' => build.status,
              'started_at' => build.started_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'finished_at' => build.finished_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'duration' => build.duration,
              'commit' => commit.commit,
              'branch' => commit.branch,
              'message' => commit.message,
              'committed_at' => commit.committed_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'author_name' => commit.author_name,
              'author_email' => commit.author_email,
              'committer_name' => commit.committer_name,
              'committer_email' => commit.committer_email,
              'compare_url' => commit.compare_url,
              'event_type' => request.event_type,
              'matrix' => build.matrix.map { |job| Job.new(job).data },
            }
          end

          def repository_data
            {
              # 'id' => repository.id,
              # 'slug' => repository.slug
            }
          end
        end
      end
    end
  end
end
