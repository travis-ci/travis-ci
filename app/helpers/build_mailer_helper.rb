module BuildMailerHelper

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

    hours   = hours(diff)
    minutes = minutes(diff, hours)
    seconds = seconds(diff, hours, minutes)

    time_pieces = []

    time_pieces << I18n.t(:'datetime.distance_in_words.hours_exact',   :count => hours)   if hours > 0
    time_pieces << I18n.t(:'datetime.distance_in_words.minutes_exact', :count => minutes) if hours > 0 || minutes > 0
    time_pieces << I18n.t(:'datetime.distance_in_words.seconds_exact', :count => seconds)

    time_pieces.to_sentence
  end


  def hours(diff)
    (diff / ONE_HOUR).to_i
  end

  def minutes(diff, hours)
    hours_diff = hours_expanded(hours, true)

    if hours_diff < diff
      ((diff - hours_diff) / ONE_MINUTE).to_i
    else
      0
    end
  end

  def seconds(diff, hours, minutes)
    hours_diff   = hours_expanded(hours)
    minutes_diff = (minutes * ONE_MINUTE)

    hours_mins = hours_diff + minutes_diff

    ((diff - hours_mins) / ONE_MINUTE).to_i
  end

  def hours_expanded(hours, min_one_hour = false)
    hours = 1 if hours == 0
    hours * ONE_HOUR
  end

  ONE_HOUR = 3600
  ONE_MINUTE = 60

end