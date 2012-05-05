module RepositoriesHelper
  def cctray_build_result(result)
    case result
    when 0
      'Success'
    when 1
      'Failure'
    else
      'Unknown'
    end
  end

  def cctray_build_activity(build)
    return 'Sleeping' unless build

    if build.started? && !build.finished?
      'Building'
    elsif build.finished?
      'Sleeping'
    end
  end
end
