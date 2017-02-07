module BuildMailerHelper
  def title(build)
    "Build Update for #{build.repository.slug}"
  end

  def print_build_matrix_summary(matrix)
    title = '#      RVM       Duration             Status      Build Log'
    summary_lines = matrix.map do |build|
      [build.number, build.config["RVM"], build_duration(build.started_at, build.finished_at), build.status, "build.link"]
    end
    title
  end

  # 1 hour, 10 minutes, and 15 seconds
  # 1 hour, 0 minutes, and 5 seconds
  # 1 minutes and 1 second
  # 15 seconds
  def build_duration(started_at, finished_at)
    # difference in seconds
    diff = (finished_at - started_at).to_i

    hours   = hours_part(diff)
    minutes = minutes_part(diff)
    seconds = seconds_part(diff)

    time_pieces = []

    time_pieces << I18n.t(:'datetime.distance_in_words.hours_exact',   :count => hours)   if hours > 0
    time_pieces << I18n.t(:'datetime.distance_in_words.minutes_exact', :count => minutes) if hours > 0 || minutes > 0
    time_pieces << I18n.t(:'datetime.distance_in_words.seconds_exact', :count => seconds)

    time_pieces.to_sentence
  end

  ONE_HOUR = 3600
  ONE_MINUTE = 60

  def hours_part(diff)
    diff / ONE_HOUR
  end

  def minutes_part(diff)
    (diff % ONE_HOUR) / ONE_MINUTE
  end

  def seconds_part(diff)
    diff % ONE_MINUTE
  end
end
