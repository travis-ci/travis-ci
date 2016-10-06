require 'fileutils'
%w(assets/stylesheets assets/javascripts).each do |path|
  path = Rails.root.join('tmp', path)
  path.rmtree rescue nil
  path.mkpath
end

# Serve both compass css and jammit javascript from the tmp directory
TravisCi::Application.config.middleware.insert_before(
  'Rack::Sendfile',
  'ActionDispatch::Static',
  "#{Rails.root}/tmp/assets"
)

# Jammit doesn't seem to support custom envs by itself ...
if Rails.env.jasmine?
  ActionController::Base.class_eval do
    append_before_filter do
      Jammit.reload!
      Jammit.set_package_assets(false)
    end
  end
end


