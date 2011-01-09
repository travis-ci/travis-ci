class User < ActiveRecord::Base
  devise :oauth2_authenticatable

  def before_oauth2_auto_create(attributes)
    self.update_attributes!(attributes['user'].slice(*%w(name login email)))
  end
end


