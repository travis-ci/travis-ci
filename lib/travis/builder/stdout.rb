require 'em/stdout'

module Travis
  class Builder
    module Stdout
      attr_reader :stdout

      def work!
        @stdout = EM.split_stdout do |c|
          c.callback { |data| on_log(data) }
        end
        super
      end
    end
  end
end
