class Build
  module Messages
    def status_message
      if pending?
        'Pending'
      elsif prev = previous_on_branch
        if passed?
          prev.passed? ? 'Passed' : 'Fixed'
        else
          prev.passed? ? 'Broken' : 'Still Failing'
        end
      else
        passed? ? 'Passed' : 'Failed'
      end
    end

    def human_status_message
      case status_message
      when "Pending";       "The build is pending."
      when "Passed";        "The build passed."
      when "Failed";        "The build failed."
      when "Fixed";         "The build was fixed."
      when "Broken";        "The build was broken."
      when "Still Failing"; "The build is still failing."
      else status_message
      end
    end
  end
end
