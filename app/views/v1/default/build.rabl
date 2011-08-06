object @build

attributes :id, :repository_id, :number, :state, :status,
           :started_at, :finished_at, :config

glue @build.commit do
  extends 'v1/default/commit'
end

code :matrix do
  @build.matrix.map { |task| Travis::Renderer.hash(task) }
end
