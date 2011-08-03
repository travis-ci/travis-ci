require 'uri'
require 'core_ext/hash/compact'

class Repository < ActiveRecord::Base
  has_many :requests, :dependent => :delete_all
  has_many :builds, :dependent => :delete_all

  has_one :last_build,   :class_name => 'Build', :order => 'id DESC', :conditions => { :state  => ['started', 'finished']  }
  has_one :last_success, :class_name => 'Build', :order => 'id DESC', :conditions => { :status => 0 }
  has_one :last_failure, :class_name => 'Build', :order => 'id DESC', :conditions => { :status => 1 }

  validates :name,       :presence => true, :uniqueness => { :scope => :owner_name }
  validates :owner_name, :presence => true
  validate :last_build_status_cannot_be_overridden

  attr_accessor :last_build_status_overridden

  class << self
    def timeline
      where(arel_table[:last_build_started_at].not_eq(nil)).order(arel_table[:last_build_started_at].desc)
    end

    def recent
      limit(20)
    end

    def by_owner_name(owner_name)
      where(:owner_name => owner_name)
    end

    def find_or_create_by_github_repository(data)
      find_or_create_by_name_and_owner_name(data.name, data.owner_name) do |r|
        r.update_attributes!(data.to_hash)
      end
    end

    def search(query)
      where("repositories.name LIKE ? OR repositories.owner_name LIKE ?", "%#{query}%", "%#{query}%")
    end

    def find_and_remove_service_hook(owner_name, name, user)
      repo = find_by_name_and_owner_name(name, owner_name)
      repo.active = false

      if repo.valid?
        Travis::GithubApi.remove_service_hook(repo, user)
        repo.save!
        repo
      else
        raise ActiveRecord::RecordInvalid, repo
      end
    end

    def find_or_create_and_add_service_hook(owner_name, name, user)
      repo = find_or_initialize_by_name_and_owner_name(name, owner_name)
      repo.active = true

      if repo.valid?
        Travis::GithubApi.add_service_hook(repo, user)
        repo.save!
        repo
      else
        raise ActiveRecord::RecordInvalid, repo
      end
    end

    def github_repos_for_user(user)
      github_repos = Travis::GithubApi.repository_list_for_user(user.login)

      repo_name_active_array = where(:owner_name => user.login).select([:active, :name]).map { |repo| [repo.name, repo.active] }
      names_and_active = Hash[repo_name_active_array]

      github_repos.each do |repo|
        if names_and_active[repo.name].nil?
          repo.active = false
        else
          repo.active = names_and_active[repo.name]
        end
      end
    end

    def find_by_params(params)
      if id = params[:id] || params[:repository_id]
        self.find(id)
      else
        self.where(params.slice(:name, :owner_name)).first
      end
    end
  end

  def override_last_build_status?(hash)
    last_build && Build.keys_for(hash).present?
  end

  def override_last_build_status!(hash)
    last_build_status_overridden = true
    matrix = self.last_build.matrix_for(hash)
    self.last_build_status = if matrix.present?
      # Set last build status to failing if any of the selected builds are failing
      matrix.all?(&:passed?) ? 0 : 1
    else
      nil
    end
  end

  def last_build_status_cannot_be_overridden
    errors.add(:last_build_status, "can't be overridden") if last_build_status_overridden
  end

  def human_status(branches = nil)
    if build = last_finished_build(branches)
      build.status == 0 ? 'stable' : 'unstable'
    else
      'unknown'
    end
  end

  def slug
    @slug ||= [owner_name, name].join('/')
  end

  def last_finished_build(branches = nil)
    branches ||= []
    branches = branches.split(',') if branches.is_a?(String)

    scope = builds.finished
    scope = scope.on_branch(branches) if branches.present?
    scope.descending.first
  end
end
