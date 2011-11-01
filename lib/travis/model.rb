require 'active_support/core_ext/string/inflections'
require 'active_support/core_ext/module/delegation'

module Travis
  class Model
    autoload :Artifact,    'travis/model/artifact'
    autoload :Build,       'travis/model/build'
    autoload :Job,         'travis/model/job'
    autoload :Request,     'travis/model/request'
    autoload :ServiceHook, 'travis/model/service_hook'

    class << self
      def find(id)
        new(self.class.name.demodulize.constantize.find(id))
      end
    end

    delegate :save!, :to => :record

    attr_reader :record

    def initialize(record)
      @record = record
    end
  end
end
