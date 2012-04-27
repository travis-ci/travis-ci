module Travis
  module Api
    module Json
      module Http
        class Repositories
          attr_reader :repositories

          def initialize(repositories, options = {})
            @repositories = repositories
          end

          def data
            repositories.map { |repository| repository_data(repository) }
          end

          def repository_data(repository)
            {
              'id' => repository.id,
              'slug' => repository.slug,
              'description' => repository.description,
              'last_build_id' => repository.last_build_id,
              'last_build_number' => repository.last_build_number,
              'last_build_status' => repository.last_build_status,
              'last_build_result' => repository.last_build_status,
              'last_build_duration' => repository.last_build_duration,
              'last_build_language' => repository.last_build_language,
              'last_build_started_at' => repository.last_build_started_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'last_build_finished_at' => repository.last_build_finished_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
              'branch_summary' => branch_summary_data(repository)
            }
          end

          def branch_summary_data(repository)
            repository.last_finished_builds_by_branches.map do |build|
              {
                'build_id' => build.id,
                'commit' => build.commit.commit,
                'branch' => build.commit.branch,
                'message' => build.commit.message,
                'status' => build.status,
                'finished_at' => build.finished_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'started_at' => build.started_at.strftime('%Y-%m-%dT%H:%M:%SZ')
              }
            end
          end
        end
      end
    end
  end
end
