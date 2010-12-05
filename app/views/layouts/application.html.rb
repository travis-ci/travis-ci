class Layouts::Application < Minimal::Template
  def to_html
    doctype
    html do
      head
      body do
        block.call
      end
    end
  end

  def doctype
    self << '<!DOCTYPE html>'.html_safe
  end

  def head
    super do
      title 'Travis'
      stylesheet_link_tag :all
      javascript_include_tag :defaults, :socky
      csrf_meta_tag
      socky
    end
  end

  def socky
    client_id = UUID.create.to_s
    random_host = Socky.random_host
    host  = (random_host[:secure] ? "wss://" : "ws://") + random_host[:host]
    port  = random_host[:port]
    query = { :client_id => client_id }.to_query

    javascript_tag <<-js
      Socky.client_id = '#{client_id}';
      Socky.connection = new Socky('#{host}', '#{port}', '#{query}');
    js
  end
end
