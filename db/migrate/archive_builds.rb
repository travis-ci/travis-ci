require File.expand_path('config/environment')

Build.class_eval do
  def self.to_archive
    where(archived_at: nil).includes(matrix: :log).order('id DESC')
  end
end

archive = lambda { |build| Travis::Notifications::Handler::Archive.new.send(:archive, build) }

Build.to_archive.limit(50).each(&archive)
