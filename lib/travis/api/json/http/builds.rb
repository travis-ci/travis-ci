module Travis
  module Api
    module Json
      module Http
        class Builds
          attr_reader :builds

          def initialize(builds, options = {})
            @builds = builds
          end

          def data
            builds.map { |build| build_data(build) }
          end

          def build_data(build)
            commit = build.commit
            request = build.request
            {
              'id' => build.id,
              'repository_id' => build.repository_id,
              'number' => build.number,
              'state' => build.state,
              'result' => build.status,
              'started_at' => build.started_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'finished_at' => build.finished_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'duration' => build.duration,
              'commit' => commit.commit,
              'branch' => commit.branch,
              'message' => commit.message,
              'event_type' => request.event_type,
            }
          end
        end
      end
    end
  end
end
