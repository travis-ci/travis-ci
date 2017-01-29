object @build

attributes :id, :repository_id, :number, :state, :started_at, :finished_at, :config, :status

node(:result) { @build.status }

glue :commit do
  extends 'v1/default/commit'
end

code :matrix do |build|
  build.matrix.map { |task| Travis::Renderer.hash(task, :params => @_locals[:params]) }
end
