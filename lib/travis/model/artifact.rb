require 'active_record'

class Artifact < ActiveRecord::Base
  autoload :Log, 'travis/model/artifact/log'

  belongs_to :job
end
