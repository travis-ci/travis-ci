object @configure

attributes :id

glue @configure.commit do
  extends 'v1/job/commit'
end

