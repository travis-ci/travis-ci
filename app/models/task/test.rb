# This task is owned by a Build
class Task::Test < Task
  include Tagging

  states :created, :started, :cloned, :installed, :finished

  event :start,  :to => :started, :after => :propagate
  event :finish, :to => :finished, :after => [:add_tags, :propagate]

  def start(data = {})
    self.started_at = data[:started_at]
  end

  def finish(data = {})
    self.status, self.finished_at = *data.values_at(:status, :finished_at)
  end

  def passed?
    status == 0
  end

  def failed?
    status == 1
  end

  def unknown?
    status == nil
  end

  protected

    def extract_finishing_attributes(attributes)
      extract!(attributes, :finished_at, :status)
    end
end
