# This task is owned by a Build
class Task::Test < Task
  states :created, :started, :cloned, :installed, :finished

  event :start,  :to => :started, :after => :propagate
  event :finish, :to => :finished, :after => :propagate

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", self.id])
  end

  def finish(data)
    self.status = data[:status]
  end
end
