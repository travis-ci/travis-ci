class Build::Task::Configure < Build::Task
  event :finish, :to => :finished, :after => :configure_build

  def configure_build(event, config)
    build.configure(config)
    build.save! # TODO why is this necessary here if self is saved afterwards? isn't the build dirty? won't it be saved?
  end
end

