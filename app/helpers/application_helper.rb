module ApplicationHelper

  def active_page?(page)
    controller, action = page.split('#')
    params[:controller] == controller && params[:action] == action
  end

  def gravatar(user, options = {})
    settings = { :size => 48 }.merge(options)
    image_tag("http://www.gravatar.com/avatar/#{user.profile_image_hash}?s=#{settings[:size]}&d=mm", :alt => user.name, :class => "profile-avatar")
  end

  def body_id
    body_id_name = content_for(:body_id)
    body_id_name.present? ? body_id_name : 'home'
  end

  def top_bar_menu_item(name, path, options = {})
    active = (request.env['PATH_INFO'] == path ? 'current' : nil)
    content_tag('li', :class => active) do
      link_to name, path, options
    end
  end

end
