namespace :travis do
  desc "Create an admin user unless a user exists. Set the first User as an admin."
  task :create_admin_user => :environment do
    u = User.first || User.create(:name => 'Admin', :login => 'admin')
    u.is_admin = true
    u.save(false)
  end
end
