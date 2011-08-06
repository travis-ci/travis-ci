object @test

attributes :id, :number, :config

glue @test.commit do
  extends 'v1/job/commit'
end

