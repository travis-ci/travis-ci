require 'active_support/concern'

class Job
  module Requeueing
    extend ActiveSupport::Concern

    FORCE_FINISH_MESSAGE = <<-msg.strip
      This job could not be processed and was forcefully finished.
    msg

    included do
      class << self
        def cleanup
          unfinished.stalled.each do |job|
            job.requeueable? ? job.enqueue : job.force_finish
          end
        end

        def unfinished
          where("state <> 'finished'")
        end

        def stalled
          where('created_at < ?', Time.now - Travis.config.jobs.retry.after)
        end
      end
    end

    def enqueue
      Travis::Notifications::Worker.enqueue(self)
      update_attribute(:retries, retries + 1)
    end

    def force_finish
      append_log!("\n#{FORCE_FINISH_MESSAGE}") if respond_to?(:append_log!)
      finish!(:status => 1, :finished_at => Time.now)
    end

    def requeueable?
      retries < Travis.config.jobs.retry.max_attempts
    end
  end
end
