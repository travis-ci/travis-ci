class Commit < ActiveRecord::Base
  belongs_to :repository
  validates :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :presence => true
end

