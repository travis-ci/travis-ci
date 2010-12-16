class Layouts::Application < Minimal::Template
  # GITHUB_PAYLOADS = {
  #   'gem-release'      => %({ "repository": { "uri": "file:///Volumes/Users/sven/Development/projects/gem-release" },      "commits": [{ "id": "9854592" }] }),
  #   'minimal'          => %({ "repository": { "uri": "file:///Volumes/Users/sven/Development/projects/minimal" },          "commits": [{ "id": "91d1b7b" }] }),
  #   'rack-cache-purge' => %({ "repository": { "uri": "file:///Volumes/Users/sven/Development/projects/rack-cache-purge" }, "commits": [{ "id": "3d2bf4c" }] })
  # }
  GITHUB_PAYLOADS = {
    'gem-release'      => %({ "repository": { "uri": "http://github.com/svenfuchs/gem-release" },      "commits": [{ "id": "9854592" }] }),
    'minimal'          => %({ "repository": { "uri": "http://github.com/svenfuchs/minimal" },          "commits": [{ "id": "add057e" }] }),
    'rack-cache-purge' => %({ "repository": { "uri": "http://github.com/svenfuchs/rack-cache-purge" }, "commits": [{ "id": "83194fc" }] })
  }

  def to_html
    doctype
    html do
      head
      body do
        div :id => :top do
          github_pings
        end

        div :id => :left do
          render 'repositories/list'
        end

        div :id => :right do
          block.call
        end

        js_templates
        js_init_data
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
        stylesheet_link_tag :all
        javascript_include_tag :defaults, 'socky', 'underscore', 'backbone', 'handlebars'
        csrf_meta_tag
        socky
      end
    end

    def github_pings
      ul do
        GITHUB_PAYLOADS.each do |name, payload|
          li { link_to name, builds_path, :class => 'github_ping', :'data-payload' => payload }
        end
      end
    end

    def socky
      javascript_tag <<-js
        new Socky('ws://127.0.0.1', '8080', '');
      js
    end

    def js_templates
      dir = Rails.root.join('public/templates/')
      Dir["#{dir}**/*.*"].each do |path|
        template = File.read(path)
        name = path.gsub(dir, '').sub(File.extname(path), '')
        content_tag :script, template.html_safe, :type => 'text/x-js-template', :name => name
      end
    end

    def js_init_data
      javascript_tag <<-js
        var INIT_DATA = { repositories: #{Repository.all.as_json.to_json} };
      js
    end
end
