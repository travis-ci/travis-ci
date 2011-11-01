class Job
  class Test < Job
    autoload :States, 'travis/model/job/test/states'

    include Test::States, Tagging

    class << self
      def append_log!(id, chars)
        job = find(id, :select => [:id, :repository_id, :owner_id, :owner_type, :state], :include => :repository)
        job.append_log!(chars) unless job.finished?
      end
    end

    def append_log!(chars)
      log.append(chars)
      super
    end
  end
end
