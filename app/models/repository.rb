require 'uri'
require 'core_ext/hash/compact'
require 'travis/git_hub_api'

class Repository < ActiveRecord::Base
  attr_accessor :last_build_status_overridden
  has_many :builds, :conditions => 'parent_id IS null', :dependent => :delete_all

  has_one :last_build,          :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND started_at IS NOT NULL'
  has_one :last_success,        :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND status = 0'
  has_one :last_failure,        :class_name => 'Build', :order => 'id DESC', :conditions => 'parent_id IS NULL AND status = 1'

  validates :name,       :presence => true, :uniqueness => { :scope => :owner_name }
  validates :owner_name, :presence => true
  validate :last_build_status_cannot_be_overridden

  STATUSES = {nil => "unknown", 0 => "passing", 1 => "failing"}
  BRANCH_KEY = 'branch'

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

    def search(query)
      where("repositories.name ~* ? OR repositories.owner_name ~* ?", query, query)
    end

    def find_and_remove_service_hook(owner_name, name, user)
      repo = find_by_name_and_owner_name(name, owner_name)
      repo.is_active = false

      if repo.valid?
        Travis::GitHubApi.remove_service_hook(repo, user)
        repo.save!
        repo
      else
        raise ActiveRecord::RecordInvalid, repo
      end
    end

    def find_or_create_and_add_service_hook(owner_name, name, user)
      repo = find_or_initialize_by_name_and_owner_name(name, owner_name)
      repo.is_active = true

      if repo.valid?
        Travis::GitHubApi.add_service_hook(repo, user)
        repo.save!
        repo
      else
        raise ActiveRecord::RecordInvalid, repo
      end
    end

    def github_repos_for_user(user)
      github_repos = Travis::GitHubApi.repository_list_for_user(user.login)

      repo_name_is_active_array = where(:owner_name => user.login).select([:is_active, :name]).map{ |repo| [repo.name, repo.is_active] }
      names_and_is_active = Hash[repo_name_is_active_array]

      github_repos.each do |repo|
        if names_and_is_active[repo.name].nil?
          repo.is_active = false
        else
          repo.is_active = names_and_is_active[repo.name]
        end
      end
    end

    def find_by_params(params)
      if id = params[:repository_id] || params[:id]
        self.find(id)
      else
        self.where(params.slice(:name, :owner_name)).first
      end
    end
  end

  def last_finished_build(hash={})
    branches = hash[BRANCH_KEY].try(:split, ',')

    builds.
      where('parent_id IS NULL AND finished_at IS NOT NULL').
      where(branches.blank? ? [] : ['branch IN (?)', branches]).
      order('id DESC').first
  end

  def override_last_finished_build_status!(hash)
    self.last_build_status_overridden = true
    last_finished_build = last_finished_build(hash)
    matrix = last_finished_build.try(:matrix_for, hash)

    self.last_build_status = if matrix.present?
      self.last_build_status_overridden = true
      if matrix.all?(&:passed?)
        0
      elsif matrix.any?(&:failed?)
        1
      elsif matrix.any?(&:unknown?)
        nil
      end
    else
      last_finished_build.try(:status)
    end
  end

  def last_build_status_cannot_be_overridden
    errors.add(:last_build_status, "can't be overridden") if last_build_status_overridden
  end

  def last_finished_build_status_name
    STATUSES[last_build_status]
  end

  def slug
    @slug ||= [owner_name, name].join('/')
  end

  base_attrs       = [:id]
  last_build_attrs = [:last_build_id, :last_build_number, :last_build_status, :last_build_started_at, :last_build_finished_at]
  all_attrs        = base_attrs + last_build_attrs

  JSON_ATTRS = {
    :default         => all_attrs,
    :job             => base_attrs,
    :'build:queued'  => base_attrs,
    :'build:removed' => base_attrs,
    :'build:log'     => [:id],
    :webhook         => [:id, :name, :owner_name]
  }
  JSON_METHODS = {
    :default         => [:slug],
    :'build:log'     => [],
    :webhook         => []
  }

  def as_json(options = nil)
    options ||= {} # ActiveSupport seems to pass nil here?
    attrs   = JSON_ATTRS[options[:for]]   || JSON_ATTRS[:default]
    methods = JSON_METHODS[options[:for]] || JSON_METHODS[:default]
    super(:only => attrs, :methods => methods) #.compact
  end
end
