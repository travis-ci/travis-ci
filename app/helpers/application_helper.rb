module ApplicationHelper
  def broadcast
    Travis::Services::Users::FindBroadcasts.new(current_user).run.first if signed_in?
  end

  def active_page?(page)
    controller, action = page.split('#')
    params[:controller] == controller && params[:action] == action
  end

  def gravatar(user, options = {})
    settings = { :size => 48 }.merge(options)
    protocol = controller.request.protocol
    host = "#{protocol == 'https://' ? 'secure' : 'www'}.gravatar.com"
    image_tag("#{protocol}#{host}/avatar/#{user.profile_image_hash}?s=#{settings[:size]}&d=mm", :alt => user.name, :class => "profile-avatar")
  end

  def body_id
    id = content_for(:body_id)
    id.present? ? id : 'home'
  end

  def top_bar_menu_item(name, path, options = {})
    active = (request.env['PATH_INFO'] == path ? 'current' : nil)
    content_tag('li', :class => active) do
      link_to name, path, options
    end
  end

  def switch_locale_link(name, options ={})
    merged_options = request.query_parameters.merge({:hl => options.delete(:hl)})
    query = merged_options.map { |key, value| "#{key}=#{value}"}.join("&")
    path = query.blank? ? request.path : "#{request.path}?#{query}"
    link_to name, path, options
  end
end
