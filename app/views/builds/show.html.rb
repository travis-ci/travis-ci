class Builds::Show < Minimal::Template
  def to_html
    div :id => :build do
      h3 "Build ##{build.number}"
      build_summary
      h4 'Build log'
      build_log
    end
  end

  protected

    def build_summary
      ul :id => :summary do
        li "Commit: #{link_to_commit(build)}".html_safe
        li "Finished: #{finished(build)}".html_safe if build.finished?
        li "Duration: #{duration(build)}".html_safe
        li "Built on agent #{build.agent}"
      end
    end

    def build_log
      pre build.log, :id => :build_log, :'data-repository_id' => build.repository.id
    end

    def link_to_commit(build)
      capture { link_to("[#{build.commit}] #{build.message}", "#{build.repository.uri}/commit/#{build.commit}", :class => :commit) }
    end

    def duration(build)
      capture { span(format_duration(build), :class => :duration) }
    end

    def finished(build)
      capture { span(format_finished(build), :class => :finished_at) }
    end

    def format_duration(build)
      "#{build.duration} sec"
    end

    def format_finished(build)
      "#{time_ago_in_words(build.finished_at)} ago"
    end
end
