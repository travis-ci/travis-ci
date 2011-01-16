class Layouts::Application < Minimal::Template
  def to_html
    doctype
    html do
      head
      body do
        div :id => :top do
          ul do
            li { sign_in_link }
          end
        end

        div '', :id => :left
        div '', :id => :right
        div '', :id => :main, :class => :clearfix

        js_init_data
        js_templates
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

    def sign_in_link
      current_user ? link_to('Sign out', destroy_session_path) : link_to_oauth2('Sign in with Github')
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
