# This task belongs to a Request instances and will configure and validate the
# request before it gets to create a Build insatnce.

class Task::Configure < Task
  states :created, :started, :finished

  event :start,  :to => :started, :after => :propagate
  event :finish, :to => :finished, :after => :configure_owner
  # event :all, :after => :propagate

  def configure_owner(event, config)
    owner.configure!(config)
  end
end
