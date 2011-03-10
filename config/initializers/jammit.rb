if Rails.env.jasmine?
  ActionController::Base.class_eval do
    append_before_filter do
      Jammit.reload!
      Jammit.set_package_assets(false)
    end
  end
end

