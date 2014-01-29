require 'responders'

class ApiController < ActionController::Metal
  include ActionController::RackDelegation
  include ActionController::Head
  include ActionController::Rendering
  include ActionController::Renderers::All
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionController::Rescue
  include ActionController::Helpers
  include ActionController::Instrumentation
  include ActionController::ConditionalGet
  include ActiveRecord::Railties::ControllerRuntime # is this needed?

  extend Responders::ControllerMethod
  include Travis::Services::Helpers

  rescue_from ActiveRecord::RecordNotFound, :with => :not_found

  append_view_path "#{Rails.root}/app/views"

  def not_found
    render :file => "#{Rails.root}/public/404", :formats => [:html], :status => 404
  end
end
