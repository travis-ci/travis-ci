require 'uri'
require 'core_ext/hash/compact'

class Repository < ActiveRecord::Base
  has_many :builds, :dependent => :delete_all, :conditions => 'parent_id IS null'
  has_one :last_build,          :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS NULL AND started_at IS NOT NULL'
  has_one :last_finished_build, :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS NULL AND finished_at IS NOT NULL'
  has_one :last_success,        :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS NULL AND status = 0'
  has_one :last_failure,        :class_name => 'Build', :order => 'started_at DESC', :conditions => 'parent_id IS NULL AND status = 1'

  class << self
    def timeline
      where(arel_table[:last_build_started_at].not_eq(nil)).order(arel_table[:last_build_started_at].desc)
    end

    def recent
      limit(20)
    end

    def human_status_by_name(name)
      repository = find_by_name(name)
      return 'unknown' unless repository && repository.last_finished_build
      repository.last_finished_build.status == 0 ? 'stable' : 'unstable'
    end
  end

  before_create :init_names

  base_attrs       = [:id, :name]
  last_build_attrs = [:last_build_id, :last_build_number, :last_build_status, :last_build_started_at, :last_build_finished_at]
  all_attrs        = base_attrs + last_build_attrs

  JSON_ATTRS = {
    :default          => all_attrs,
    :job              => base_attrs,
    :'build:queued'   => base_attrs,
    :'build:log'      => [:id],
    :'build:started'  => all_attrs,
    :'build:finished' => all_attrs
  }

  def as_json(options = nil)
    options ||= {} # ActiveSupport seems to pass nil here?
    super(:only => JSON_ATTRS[options[:for] || :default]) #.compact
  end


  protected

    def init_names
      self.name ||= URI.parse(url).path.split('/')[-2, 2].join('/')
    end
end
