# This task is owned by a Build
class Task::Test < Task
  states :created, :started, :cloned, :installed, :finished

  event :start,  :to => :started, :after => :propagate
  event :finish, :to => :finished, :after => :propagate

  def finish(data)
    self.status = data[:status]
  end

  protected

    def extract_finishing_attributes(attributes)
      extract!(attributes, :finished_at)
    end
end
