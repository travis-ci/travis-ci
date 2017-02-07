# This task belongs to a Request instances and will configure and validate the
# request before it gets to create a Build insatnce.

class Task::Configure < Task
  states :created, :started, :finished

  event :start,  :to => :started,  :after => :propagate
  event :finish, :to => :finished, :after => :configure_owner

  def finish(data)
    self.config = data[:config]
  end

  def configure_owner(event, config)
    owner.configure!(config)
  end

  protected

    def extract_finishing_attributes(attributes)
      extract!(attributes, :config)
    end
end
