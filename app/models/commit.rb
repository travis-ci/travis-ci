class Commit < ActiveRecord::Base
  validates :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :presence => true
end

