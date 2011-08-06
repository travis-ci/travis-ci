object @test

attributes :id, :repository_id, :number, :state, :status,
           :started_at, :finished_at, :config

node(:parent_id) { @test.owner_id }

glue @test.commit do
  extends 'v1/default/commit'
end
