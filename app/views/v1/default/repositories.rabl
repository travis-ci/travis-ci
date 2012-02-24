collection @repositories

attributes :id, :description, :last_build_id, :last_build_number, :last_build_started_at, :last_build_finished_at,
           :last_build_status, :last_build_language, :last_build_duration

node(:last_build_result) { |r| r.last_build_status(params) }

node(:slug) { |repository| repository.slug }

node(:branch_summary) { |r| r.last_finished_builds_by_branches }
