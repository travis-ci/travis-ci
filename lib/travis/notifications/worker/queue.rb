module Travis
  module Notifications
    class Worker
      class Queue
        attr_reader :name, :slug, :target, :language

        def initialize(*args)
          @name, @slug, @target, @language = *args
        end

        def matches?(slug, target, language)
          matches_slug?(slug) || matches_language?(language) # || matches_target?(target)
        end

        def queue
          name
        end

        protected

          def matches_slug?(slug)
            !!self.slug && (self.slug == slug)
          end

          def matches_target?(target)
            !!self.target && (self.target == target)
          end

          def matches_language?(language)
            !!self.language && (self.language == language)
          end
      end
    end
  end
end
