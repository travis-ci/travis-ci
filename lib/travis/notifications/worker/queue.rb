module Travis
  module Notifications
    class Worker
      class Queue
        attr_reader :name, :slug, :target

        def initialize(*args)
          @name, @slug, @target = *args
        end

        def matches?(slug, target)
          matches_slug?(slug) || matches_target?(target)
        end

        def to_s
          'Travis::Worker'
        end

        def queue
          name
        end

        def ==(other)
          to_s == other.to_s
        end

        protected

          def matches_slug?(slug)
            self.slug && (self.slug == slug)
          end

          def matches_target?(target)
            self.target && (self.target == target)
          end
      end
    end
  end
end
