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
      self << socky(:client_id => UUID.create.to_s)
    end
  end
end
