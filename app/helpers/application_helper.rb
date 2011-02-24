module ApplicationHelper
  def active_page?(pages = {})
    is_active = pages.include?(params[:controller]) || pages.include?(params[:controller].split('/')[0])
    is_active = pages[params[:controller]].include?(params[:action]) if is_active && pages[params[:controller]] && !pages[params[:controller]].empty?
    is_active
  end
end
