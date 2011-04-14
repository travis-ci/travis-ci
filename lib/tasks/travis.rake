namespace :travis do
  desc "set the first User as an admin"
  task :create_admin_user => :environment do
    u = User.first
    u.is_admin = true
    u.save(false)
  end
end
