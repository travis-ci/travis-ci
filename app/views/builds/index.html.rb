class Builds::Index < Minimal::Template
  # GITHUB_PAYLOADS = {
  #   'gem-release'      => %({ "repository": { "uri": "file:///Volumes/Users/sven/Development/projects/gem-release" },      "commits": [{ "id": "9854592" }] }),
  #   'minimal'          => %({ "repository": { "uri": "file:///Volumes/Users/sven/Development/projects/minimal" },          "commits": [{ "id": "91d1b7b" }] }),
  #   'rack-cache-purge' => %({ "repository": { "uri": "file:///Volumes/Users/sven/Development/projects/rack-cache-purge" }, "commits": [{ "id": "3d2bf4c" }] })
  # }
  GITHUB_PAYLOADS = {
    'gem-release'      => %({ "repository": { "uri": "http://github.com/svenfuchs/gem-release" },      "commits": [{ "id": "9854592" }] }),
    'minimal'          => %({ "repository": { "uri": "http://github.com/svenfuchs/minimal" },          "commits": [{ "id": "add057e" }] }),
    'rack-cache-purge' => %({ "repository": { "uri": "http://github.com/svenfuchs/rack-cache-purge" }, "commits": [{ "id": "3d2bf4c" }] })
  }

  def to_html
    div :id => :left do
      repositories_list
    end

    div :id => :main do
      build_log
    end

    div :id => :right do
      github_pings
    end
  end

  def repositories_list
    h4 'Repositories'
    ul :id => :repositories do
      repositories.each do |repository|
        content_tag_for :li, repository, :class => "status #{status(repository.last_build)}" do
          link_to repository.name, repository.uri
          if build = repository.last_build
            link_to "##{build.number}", build, :class => 'last_build'
          end
        end
      end
    end
  end

  def build_log
    h4 'Build'
    pre '', :id => :build
  end

  def github_pings
    h4 'Github pings'
    ul do
      GITHUB_PAYLOADS.each do |name, payload|
        li { link_to name, builds_path, :class => 'github_ping', :'data-payload' => payload }
      end
    end
  end

  def status(build)
    if build
      build.passed? ? :green : :red
    else
      ''
    end
  end
end
