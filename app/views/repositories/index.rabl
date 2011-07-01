collection @repositories

attributes :id, :last_build_id,
           :last_build_number, :last_build_status,
           :last_build_started_at, :last_build_finished_at

node(:slug) { |repository| repository.slug }
