class Repositories::Show < Minimal::Template
  def to_html
    div :id => 'repository' do
      h3 repository.name
      build_summaries
      h4 'Build history'
      build_history
    end
  end

  protected

    def build_summaries
      ul :id => 'summary' do
        [:success, :failure].each do |status|
          build_summary(status)
        end
      end
    end

    def build_history
      table :id => :build_history do
        repository.builds.order('created_at DESC').each do |build|
          tr do
            td { link_to_build(build) }
            td { build.commit }
            td { format_duration(build) }
            td { format_finished(build) if build.finished? }
          end
        end
      end
    end

    def build_summary(status)
      if build = repository.send(:"last_#{status}")
        duration = capture { span("(#{format_duration(build)})", :class => :duration) }
        finished = capture { span(format_finished(build), :class => :finished_at) }
        content  = "Last #{status}: #{link_to_build(build)} #{duration} #{finished}".html_safe
        li content, :id => :"last_#{status}"
      end
    end

    def link_to_build(build)
      capture { link_to("##{build.number}", build, :class => 'build') }
    end

    def format_duration(build)
      "#{build.duration} sec"
    end

    def format_finished(build)
      "#{time_ago_in_words(build.finished_at)} ago" if build.finished_at
    end
end
