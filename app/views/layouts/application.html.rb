class Layouts::Application < Minimal::Template
  def to_html
    doctype
    html do
      head
      body :id => params[:controller].singularize do
        div :id => :top do
          fork_me_link
          ul do
            li profile_link if signed_in?(:user)
            li sign_in_link
          end
        end

        div :id => :left do
          ul '', :id => :repositories
        end
        div '', :id => :right
        div '', :id => :main do
          block.call
        end

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
        javascript_include_tag :vendor, :lib, :app, 'application.js'
        pusher

        if Rails.env.jasmine?
          stylesheet_link_tag 'jasmine'
          javascript_include_tag :jasmine, :tests
        end
      end
    end

    def fork_me_link
      self << %Q{<a href="http://github.com/svenfuchs/travis"><img style="position: absolute; top: 0; left: 0; border: 0; z-index: 99;" src="https://assets1.github.com/img/ce742187c818c67d98af16f96ed21c00160c234a?repo=&url=http%3A%2F%2Fs3.amazonaws.com%2Fgithub%2Fribbons%2Fforkme_left_gray_6d6d6d.png&path=" alt="Fork me on GitHub"></a>}.html_safe
    end

    def profile_link
      capture { link_to 'Profile', profile_path }
    end

    def sign_in_link
      capture { current_user ? link_to('Sign out', destroy_session_path) : link_to_oauth2('Sign in with Github') }
    end

    def pusher
      javascript_tag "var pusher = new Pusher('#{Pusher.key}');"
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
        name = path.gsub(dir, '').sub(File.extname(path), '')
        content_tag :script, template.html_safe, :type => 'text/x-js-template', :name => name
      end
    end
end
