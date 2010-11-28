require 'uri'

class Repository < ActiveRecord::Base
  has_many :builds, :dependent => :delete_all
  has_one :last_build, :class_name => 'Build'

  before_create :init_name

  protected

    def init_name
      self.name ||= URI.parse(uri).path.split('/')[-2, 2].join('/')
    end
end
