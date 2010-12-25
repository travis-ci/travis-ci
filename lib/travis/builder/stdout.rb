require 'em/stdout'

module Travis
  class Builder
    module Stdout
      def work!
        stdout = EM::Stdout.new do |chars|
          on_log(chars)
        end
        stdout.split do
          super
        end
      end
    end
  end
end
