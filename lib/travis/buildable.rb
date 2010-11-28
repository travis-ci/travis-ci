require 'active_support/core_ext/string/conversions'

module Travis
  module Buildable
    autoload :Base, 'travis/buildable/base'
    autoload :Git,  'travis/buildable/git'
    autoload :File, 'travis/buildable/file'

    class << self
      def create(uri, options = {}, &block)
        type, uri = *uri.split('://')
        type = 'git' if type == 'http'
        type = const_get(type.classify)
        type.new(uri, options, &block)
      end
    end
  end
end
