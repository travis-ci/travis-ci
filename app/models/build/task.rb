class Build::Task < ActiveRecord::Base
  include SimpleStates

  set_table_name :tasks

  belongs_to :build

  states :created, :started, :finished
  event :start,  :to => :started, :after => :propagate_to_build

  def start
    self.started_at = Time.now
  end

  def finish(config)
    self.finished_at = Time.now
  end

  def propagate_to_build(*args)
    build.send(*args)
    build.save! # TODO why is this necessary here if self is saved afterwards? isn't the build dirty? won't it be saved?
  end
end

