require 'uri'
require 'core_ext/hash/compact'

class Repository < ActiveRecord::Base
  include ServiceHooks

  BRANCH_KEY = :branch

  has_many :requests, :dependent => :delete_all
  has_many :builds, :dependent => :delete_all do
    def last_status_on(params)
      last_finished_on_branch(params[:branch]).try(:matrix_status, params)
    end
  end

  has_one :last_build,   :class_name => 'Build', :order => 'id DESC', :conditions => { :state  => ['started', 'finished']  }
  has_one :last_success, :class_name => 'Build', :order => 'id DESC', :conditions => { :status => 0 }
  has_one :last_failure, :class_name => 'Build', :order => 'id DESC', :conditions => { :status => 1 }

  validates :name,       :presence => true, :uniqueness => { :scope => :owner_name }
  validates :owner_name, :presence => true

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

    def by_slug(slug)
      where(:owner_name => slug.split('/').first, :name => slug.split('/').last)
    end

    def search(query)
      where('repositories.name ~* ? OR repositories.owner_name ~* ?', query, query)
    end

    def find_by_params(params)
      if id = params[:id] || params[:repository_id]
        self.find(id)
      else
        self.where(params.slice(:name, :owner_name)).first
      end
    end
  end

  def last_build_status(params = {})
    params = params.symbolize_keys.slice(*Build.matrix_keys_for(params))
    params.blank? ? read_attribute(:last_build_status) : builds.last_status_on(params)
  end

  def slug
    @slug ||= [owner_name, name].join('/')
  end
end
