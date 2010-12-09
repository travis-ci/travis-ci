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
        javascript_include_tag :defaults #, :socky
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
      # client_id = UUID.create.to_s
      # random_host = Socky.random_host
      # host  = (random_host[:secure] ? "wss://" : "ws://") + random_host[:host]
      # port  = random_host[:port]
      # query = { :client_id => client_id }.to_query

      # javascript_tag <<-js
      #   Socky.client_id = '#{client_id}';
      #   Socky.connection = new Socky('#{host}', '#{port}', '#{query}');
      # js
    end
end
