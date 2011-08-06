class Commit < ActiveRecord::Base
  validates :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :presence => true

  base_attrs = [:commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url]
  all_attrs  = [:id] + base_attrs

  JSON_ATTRS = {
    :default => all_attrs,
    :build   => base_attrs,
    :job     => [:commit, :branch],
  }

  def as_json(options = nil)
    options ||= {}
    attrs = JSON_ATTRS[options[:for]] || JSON_ATTRS[:default]
    super(:only => attrs)
  end
end

