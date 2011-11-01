class Job
  class Configure < Job
    autoload :States, 'travis/model/job/configure/states'

    include States
  end
end
