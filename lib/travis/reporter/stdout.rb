require 'stdout_split'

module Travis
  module Reporter
    module Stdout
      def work!
        splitter = StdoutSplit.new do |chars|
          on_log(chars)
        end
        splitter.split do
          super
        end
      end
    end
  end
end
