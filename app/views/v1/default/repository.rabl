object @repository

attributes :id,
           :description,
           :last_build_id,
           :last_build_number,
           :last_build_started_at,
           :last_build_finished_at,
           :last_build_status,
           :last_build_language,
           :last_build_duration

node(:last_build_result) { |r| r.last_build_status(params) }

node(:slug) { |r| r.slug }

node(:public_key) { |r| "#{r.key.public_key}" }
