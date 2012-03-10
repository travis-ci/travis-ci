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
      locale_link_to name, path, options
    end
  end

  def locale_link_to(name, path, options = {})
    options[:hl] = request.query_parameters["hl"] if request.query_parameters["hl"]
    link_to name, path, options
  end

  def switch_locale_link(name, options ={})
    request.query_parameters[:hl] = options.delete(:hl)
    query = request.query_parameters.map { |key, value| "#{key}=#{value}"}.join("&")
    path = request.path + "?#{query}" unless query.blank?
    link_to name, path, options
  end


end
