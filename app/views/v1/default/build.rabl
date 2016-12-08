object @build

attributes :id, :repository_id, :number,
           :state, :started_at, :finished_at,
           :duration, :config, :status

node(:event_type) { |build| build.request.event_type }

node(:result) { @build.status }

glue(:commit) { extends 'v1/default/commit' }

code :matrix do |build|
  build.matrix.map do |job|
    Travis::Renderer.hash(job, :params => { :bare => true })
  end
end
