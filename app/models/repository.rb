require 'uri'

class Repository < ActiveRecord::Base
  has_many :builds, :dependent => :delete_all
  has_one :last_build,   :class_name => 'Build', :order => 'started_at DESC'
  has_one :last_success, :class_name => 'Build', :order => 'started_at DESC', :conditions => { :status => 0 }
  has_one :last_failure, :class_name => 'Build', :order => 'started_at DESC', :conditions => { :status => 1 }

  class << self
    def timeline
      includes(:last_build).order(:last_built_at)
    end
  end

  before_create :init_name

  def as_json(options = {})
    repository_keys = [:id, :name, :uri, :last_duration]
    last_build_options = { :only => [:id, :number, :commit, :message, :duration, :started_at, :finished_at, :log], :methods => [:color, :eta]}
    super(:only => repository_keys, :include => { :last_build => last_build_options })['repository']
  end

  protected

    def init_name
      self.name ||= URI.parse(uri).path.split('/')[-2, 2].join('/')
    end
end
