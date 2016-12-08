collection(@builds)

attributes :id, :repository_id, :number, :started_at, :finished_at, :duration

node(:result) { |build| build.status }

glue :commit do
  attributes :commit, :branch, :message
end

node(:event_type) { |build| build.request.event_type }