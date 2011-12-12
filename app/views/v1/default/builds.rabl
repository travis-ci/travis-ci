collection(@builds)

attributes :id, :repository_id, :number, :state, :started_at, :finished_at, :duration, :config, :status

node(:result) { |build| build.status }

glue :commit do
  extends 'v1/default/commit'
end

code :matrix do |build|
  build.matrix.map { |job| Travis::Renderer.hash(job, :params => @_locals[:params]) }
end
