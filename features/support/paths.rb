module NavigationHelpers
  def path_to(page_name)
    case page_name

    when /the dashboard page/
      '/'
    when /the repository page for: (.*)/
      repository = Repository.find_by_name($1) || raise("could not find repository #{$1}")
      url_for(repository)
    when /the build page for: (.*) #(\d+)/
      repository = Repository.where(:name => $1).first || raise("could not find repository #{$1}")
      build = repository.builds.where(:number => $2).first || raise("cound not find a build with the number #{$2} for the repository #{$1}")
      url_for(build)

    else
      begin
        page_name =~ /the (.*) page/
        path_components = $1.split(/\s+/)
        self.send(path_components.push('path').join('_').to_sym)
      rescue Object => e
        raise "Can't find mapping from \"#{page_name}\" to a path.\n" +
          "Now, go and add a mapping in #{__FILE__}"
      end
    end
  end
end

World(NavigationHelpers)
