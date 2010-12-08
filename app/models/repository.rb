require 'uri'

class Repository < ActiveRecord::Base
  has_many :builds, :dependent => :delete_all
  has_one :last_build, :class_name => 'Build', :order => 'created_at DESC'
  has_one :last_success, :class_name => 'Build', :order => 'finished_at DESC', :conditions => { :status => 0 }
  has_one :last_failure, :class_name => 'Build', :order => 'finished_at DESC', :conditions => { :status => 1 }

  before_create :init_name

  protected

    def init_name
      self.name ||= URI.parse(uri).path.split('/')[-2, 2].join('/')
    end
end
