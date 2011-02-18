class Layouts::Application < Minimal::Template
  def to_html
    doctype
    html do
      head
      body :id => params[:controller].singularize do
        div :id => :top do
          header_title

          ul :class => :breadcrumbs do
            li home_link
          end

          profile_or_signup

          fork_me_link
        end

        div :id => :left do
          repos_header
          ul '', :id => :repositories
        end
        div :id => :right do
          alpha_warning
          div '', :id => :workers
          div '', :id => :jobs
          thanks_sponsors
        end
        div '', :id => :'flash-messages'
        div '', :id => :main do
          block.call
        end

        js_includes
        js_templates
        js_init_data if Rails.env.jasmine?
      end
    end
  end

  protected

    def doctype
      self << '<!DOCTYPE html>'.html_safe
    end

    def head
      super do
        title 'Travis'
        stylesheet_link_tag 'application'

        if Rails.env.jasmine?
          stylesheet_link_tag 'jasmine'
          javascript_include_tag :jasmine, :tests
        end
      end
    end

    def header_title
      content_tag('h1', 'Travis', :class => :logo)
    end

    def profile_or_signup
      content_tag :div, :class => :profile do
        if current_user
          image_tag("http://www.gravatar.com/avatar/#{current_user.profile_image_hash}?s=30&d=mm", :alt => "", :class => "profile-avatar") +
          content_tag(:h5, profile_link) +
          link_to('Sign out', destroy_session_path)
        else
          link_to('Sign in with Github', user_omniauth_authorize_path(:github), :class => "profile-signup")
        end
      end
    end

    def fork_me_link
      self << %Q{<a href="http://github.com/svenfuchs/travis"><img style="position: absolute; top: 0; left: 0; border: 0; z-index: 99;" src="https://assets1.github.com/img/ce742187c818c67d98af16f96ed21c00160c234a?repo=&url=http%3A%2F%2Fs3.amazonaws.com%2Fgithub%2Fribbons%2Fforkme_left_gray_6d6d6d.png&path=" alt="Fork me on GitHub"></a>}.html_safe
    end

    def home_link
      capture { link_to 'Home', root_path }
    end

    def profile_link
      capture do
        profile_text = current_user.login? ? current_user.login : 'view my profile'
        link_to profile_text, profile_path
      end
    end

    def repos_header
      content_tag('h4', 'Recent Builds', :class => 'recent-builds')
    end

    def js_includes
        javascript_include_tag(:vendor, :lib, 'application', :app) +
        javascript_tag("var pusher = new Pusher('#{Pusher.key}');")
    end

    def js_init_data
      javascript_tag <<-js
        var INIT_DATA = {
          repositories: #{Repository.timeline.as_json.to_json},
          workers: #{workers.to_json},
          jobs: #{jobs.to_json}
        };
      js
    end

    def js_templates
      dir = Rails.root.join('public/javascripts/app/templates/')
      Dir["#{dir}**/*.*"].each do |path|
        template = File.read(path)
        name = path.gsub(dir.to_s, '').sub(File.extname(path), '')
        content_tag :script, template.html_safe, :type => 'text/x-js-template', :name => name
      end
    end

    def alpha_warning
      div :id => :alpha_warning, :class => :box do
        h4 "This stuff is alpha."
        p "Please do <strong>not</strong> consider this a stable service. We're still far from that! More info <a href='https://github.com/svenfuchs/travis/wiki'>here.</a>".html_safe
      end
    end

    def thanks_sponsors
      div :id => :thanks_sponsors, :class => :box do
        h4 "Thank you, sponsors!"
        p "Special thanks go out to:"
        ul do
          li '<a href="http://avarteq.de">Avarteq</a> for a server for running a build worker.'.html_safe
          li '<a href="http://pusherapp.com">Pusher.app</a> for a "big boy" account for messaging.'.html_safe
        end
        div do
          link_to('<img src="/images/logos/avarteq.png" />'.html_safe, 'http://avarteq.de')
          link_to('<img src="/images/logos/pusher.png" />'.html_safe, 'http://pusherapp.com')
        end
      end
    end
end
