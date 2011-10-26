# This job is owned by a Build

class Job::Test < Job
  def passed?
    status == 0
  end

  def failed?
    status == 1
  end

  def unknown?
    status == nil
  end
end
