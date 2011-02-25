module ApplicationHelper
  def active_page?(page)
    controller, action = page.split('#')
    params[:controller] == controller && params[:action] == action
  end
end
