xml.Projects do
  xml.Project(
    :name            => @repository.name,
    :activity        => cctray_build_activity(@repository.last_build),
    :lastBuildStatus => cctray_build_status(@repository.last_build_status(params)),
    :lastBuildLabel  => @repository.last_build_number,
    :lastBuildTime   => @repository.last_build_finished_at.try(:strftime, "%Y-%m-%dT%H:%M:%S.%L%z"),
    :webUrl          => @repository.url
  )
end
