class Repositories::List < Minimal::Template
  def to_html
    ul :id => :repositories do
      # repositories.each do |repository|
      #   classes = [status(repository.last_build), active?(repository) ? 'active' : nil].compact
      #   content_tag_for :li, repository, :class => classes.join(' ') do
      #     link_to repository.name, repository
      #     if build = repository.last_build
      #       link_to_build(build)
      #       p :class => :summary do
      #         duration(build)
      #         build.finished_at ? finished_at(build) : eta(build)
      #       end
      #     end
      #   end
      # end
    end
  end

  protected

    def active?(repository)
      self.respond_to?(:repository) && self.repository == repository
    end

    def status(build)
      build.blank? ? '' : build.passed? ? :green : :red
    end

    def link_to_build(build)
      link_to "##{build.number}", build, :class => 'last_build'
    end

    def finished_at(build)
      abbr "#{time_ago_in_words(build.finished_at)} ago", :class => 'finished_at', :'data-finished_at' => build.finished_at.iso8601
    end

    def duration(build)
      span "Duration: #{build.duration} sec", :class => 'duration'
    end

    def eta(build)
      if build.eta
        span "ETA: #{distance_of_time_in_words(Time.now, build.eta, 1)}", :class => 'eta', :'data-eta' => build.eta.iso8601
      else
        span "ETA: unknown", :class => 'eta'
      end
    end
end
