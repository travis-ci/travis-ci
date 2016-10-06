module ApplicationHelper
  def active_page?(page)
    controller, action = page.split('#')
    params[:controller] == controller && params[:action] == action
  end

  def gravatar(user, options = {})
    settings = { :size => 48 }.merge(options)
    image_tag("http://www.gravatar.com/avatar/#{user.profile_image_hash}?s=#{settings[:size]}&d=mm", :alt => user.name, :class => "profile-avatar")
  end
end
