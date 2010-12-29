class Layouts::Application < Minimal::Template
  # GITHUB_PAYLOADS = {
  #   'gem-release'      => %({ "repository": { "url": "file:///Volumes/Users/sven/Development/projects/gem-release" },      "commits": [{ "id": "9854592" }] }),
  #   'minimal'          => %({ "repository": { "url": "file:///Volumes/Users/sven/Development/projects/minimal" },          "commits": [{ "id": "91d1b7b" }] }),
  #   'rack-cache-purge' => %({ "repository": { "url": "file:///Volumes/Users/sven/Development/projects/rack-cache-purge" }, "commits": [{ "id": "3d2bf4c" }] })
  # }
  GITHUB_PAYLOADS = {
    'gem-release'      => %({ "repository": { "url": "https://github.com/svenfuchs/gem-release" },      "commits": [{ "id": "9854592", "message": "Bump to 0.0.15" }] }),
    'minimal'          => %({ "repository": { "url": "https://github.com/svenfuchs/minimal" },          "commits": [{ "id": "add057e", "message": "unignore Gemfile.lock" }] }),
    'rack-cache-purge' => %({ "repository": { "url": "https://github.com/svenfuchs/rack-cache-purge" }, "commits": [{ "id": "83194fc", "message": "add ruby-debug dependency" }] })
  }

  def to_html
    doctype
    html do
      head
      body do
        js_templates
        js_init_data

        div :id => :top do
          github_pings
        end

        div :id => :left, :class => :clearfix do
          ul '', :id => :repositories
        end

        div :id => :right, :class => :clearfix do
        end
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
        csrf_meta_tag
        pusher

        if Rails.env.jasmine?
          stylesheet_link_tag 'jasmine'
          javascript_include_tag :jasmine, :tests
        end
      end
    end

    def github_pings
      ul do
        GITHUB_PAYLOADS.each do |name, payload|
          li { link_to name, builds_path, :class => 'github_ping', :'data-payload' => payload }
        end
      end
    end

    def pusher
      javascript_tag <<-js
        var pusher = new Pusher('#{Pusher.key}');
      js
    end

    def js_templates
      dir = Rails.root.join('public/javascripts/app/templates/')
      Dir["#{dir}**/*.*"].each do |path|
        template = File.read(path)
        name = path.gsub(dir, '').sub(File.extname(path), '')
        div template.html_safe, :type => 'text/x-js-template', :name => name
      end
    end

    def js_init_data
      javascript_tag <<-js
        var INIT_DATA = { repositories: #{Repository.timeline.as_json.to_json} };
      js
    end
end
