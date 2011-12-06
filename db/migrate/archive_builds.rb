require File.expand_path('config/environment')

Build.where(:archived_at => nil).includes(:matrix => log).order('id DESC').limit(50).each do |build|
  Travis::Notifications::Handler::Archive.new.send(:archive, build)
end
