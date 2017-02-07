class Commit < ActiveRecord::Base
  belongs_to :repository
  validates :commit, :branch, :message, :committed_at, :presence => true
end
