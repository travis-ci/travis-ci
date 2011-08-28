require 'uri'
require 'core_ext/hash/compact'

class Repository < ActiveRecord::Base
  include ServiceHooks

  STATUSES = { nil => 'unknown', 0 => 'passing', 1 => 'failing' }
  BRANCH_KEY = :branch

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

    def search(query)
      where("repositories.name LIKE ? OR repositories.owner_name LIKE ?", "%#{query}%", "%#{query}%")
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

  def override_last_finished_build_status!(data)
    branches = data[Repository::BRANCH_KEY].try(:split, ',')
    build = builds.finished.on_branch(branches).descending.first
    matrix = build.try(:matrix_for, data)

    self.last_build_status = if matrix.present?
      self.last_build_status_overridden = true
      if matrix.all?(&:passed?) # TODO move to matrix_status
        0
      elsif matrix.any?(&:failed?)
        1
      elsif matrix.any?(&:unknown?)
        nil
      end
    else
      build.try(:status)
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
end
