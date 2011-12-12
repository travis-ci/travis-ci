collection @tests

attributes :id, :repository_id, :number, :queue, :state, :started_at, :finished_at, :config, :status

node(:log)      { |job| job.log.try(:content) || '' }
node(:result)   { |job| job.status }
node(:build_id) { |job| job.owner_id }

glue :commit do
  extends 'v1/default/commit'
end
