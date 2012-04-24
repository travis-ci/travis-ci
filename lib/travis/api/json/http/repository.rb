module Travis
  module Api
    module Json
      module Http
        class Repository
          attr_reader :repository

          def initialize(repository)
            @repository = repository
          end

          def data
            {
              'id' => repository.id,
              'slug' => repository.slug,
              'description' => repository.description,
              'public_key' => repository.key.public_key,
              'last_build_id' => repository.last_build_id,
              'last_build_number' => repository.last_build_number,
              'last_build_status' => repository.last_build_status,
              'last_build_result' => repository.last_build_status,
              'last_build_duration' => repository.last_build_duration,
              'last_build_language' => repository.last_build_language,
              'last_build_started_at' => repository.last_build_started_at,
              'last_build_finished_at' => repository.last_build_finished_at
            }
          end
        end
      end
    end
  end
end
