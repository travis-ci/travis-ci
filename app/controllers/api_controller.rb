require 'responders'

class ApiController < ActionController::Metal
  include ActionController::Head
  include ActionController::Rendering
  include ActionController::Renderers::All
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionController::Rescue
  include ActionController::Helpers

  extend Responders::ControllerMethod

  rescue_from ActiveRecord::RecordNotFound, :with => :not_found

  append_view_path "#{Rails.root}/app/views"

  def not_found
    render :file => "#{Rails.root}/public/404", :formats => [:html], :status => 404
  end
end
