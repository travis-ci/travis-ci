require 'uri'

class Repository < ActiveRecord::Base
  has_many :builds, :dependent => :delete_all, :conditions => 'parent_id IS null'
  has_one :last_build,          :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS null'
  has_one :last_finished_build, :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS null AND finished_at IS NOT NULL'
  has_one :last_success,        :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS null AND status = 0'
  has_one :last_failure,        :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS null AND status = 1'

  REPOSITORY_ATTRS = [:id, :name, :url, :last_duration]
  LAST_BUILD_ATTRS = [:id, :number, :commit, :message, :status, :log, :started_at, :finished_at, :author_name, :author_email, :committer_name, :committer_email]

  class << self
    def timeline
      # should probably denormalize the last build attributes which are relevant to the timeline at some point
      includes(:last_build).where(Build.arel_table[:started_at].not_eq(nil)).order(Build.arel_table[:started_at].desc)
    end

    def recent
      limit(60)
    end

    def human_status_by_name(name)
      repository = find_by_name(name)
      return 'unknown' unless repository && repository.last_finished_build
      repository.last_finished_build.status == 0 ? 'stable' : 'unstable'
    end
  end

  before_create :init_names

  def as_json(options = nil)
    options ||= {} # ActiveSupport seems to pass nil here?
    include_last_build = options.key?(:include_last_build) ? options[:include_last_build] : true
    options.reverse_merge!(:only => REPOSITORY_ATTRS)
    json = super(options)
    json.merge!(:last_build => last_build.as_json(:only => LAST_BUILD_ATTRS)) if include_last_build
    json
  end


  protected

    def init_names
      self.name ||= URI.parse(url).path.split('/')[-2, 2].join('/')
      self.username = name.split('/').first
    end
end
