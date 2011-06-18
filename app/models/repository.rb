require 'uri'
require 'core_ext/hash/compact'
require 'travis/git_hub_api'

class Repository < ActiveRecord::Base

  has_many :builds, :conditions => 'parent_id IS null', :dependent => :delete_all

  has_one :last_build,          :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND started_at IS NOT NULL'
  has_one :last_finished_build, :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND finished_at IS NOT NULL'
  has_one :last_success,        :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND status = 0'
  has_one :last_failure,        :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND status = 1'

  validates :name,       :presence => true, :uniqueness => { :scope => :owner_name }
  validates :owner_name, :presence => true

  class << self
    def timeline
      where(arel_table[:last_build_started_at].not_eq(nil)).order(arel_table[:last_build_started_at].desc)
    end

    def recent
      limit(20)
    end

    def find_or_create_by_github_repository(data)
      find_or_create_by_name_and_owner_name(data.name, data.owner_name) do |r|
        r.update_attributes!(data.to_hash)
      end
    end

    def human_status_by(attributes)
      repository = where(attributes).first
      return 'unknown' unless repository && repository.last_finished_build
      repository.last_finished_build.status == 0 ? 'stable' : 'unstable'
    end

    def search(query)
      where("repositories.name LIKE ? OR repositories.owner_name LIKE ?", "%#{query}%", "%#{query}%")
    end

    def find_or_create_and_add_service_hook(owner_name, name, user)
      repo = find_or_initialize_by_name_and_owner_name(name, owner_name)
      if repo.valid?
        Travis::GitHubApi.add_service_hook(repo, user) if repo.valid?
        repo.save!
        repo
      end
    ensure
      repo
    end
  end

  def slug
    @slug ||= [owner_name, name].join('/')
  end

  base_attrs       = [:id]
  last_build_attrs = [:last_build_id, :last_build_number, :last_build_status, :last_build_started_at, :last_build_finished_at]
  all_attrs        = base_attrs + last_build_attrs

  JSON_ATTRS = {
    :default            => all_attrs,
    :job                => base_attrs,
    :'build:queued'     => base_attrs,
    :'build:configured' => base_attrs,
    :'build:log'        => [:id]
  }
  JSON_METHODS = {
    :default            => [:slug],
    :'build:log'        => []
  }

  def as_json(options = nil)
    options ||= {} # ActiveSupport seems to pass nil here?
    attrs   = JSON_ATTRS[options[:for]]   || JSON_ATTRS[:default]
    methods = JSON_METHODS[options[:for]] || JSON_METHODS[:default]
    super(:only => attrs, :methods => methods) #.compact
  end
end
