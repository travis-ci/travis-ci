module Tabs
  include TabsHelper

  protected

  def verify_tab
    params.delete(:tab) if params[:tab] && !display_tab?(params[:tab])
    params[:tab] ||= tabs.first
  end
end
