require 'github'

class Build
  module Sources
    module Github
      extend ActiveSupport::Concern

      included do
        Build.sources << Github
      end

      class << self
        def exclude?(attributes)
          (attributes.key?(:branch) && attributes[:branch].match(/gh[-_]pages/i)) ||
          (attributes[:message] && attributes[:message].downcase.match(/\[ci ([\w ]*)\]/) && $1 == 'skip')
        end
      end

      module ClassMethods
        def create_from_github_payload(payload, token)
          data = ::Github::ServiceHook::Payload.new(payload)

          return false if data.repository.private?

          repository = Repository.find_or_create_by_github_repository(data.repository)
          number     = repository.builds.next_number
          build      = data.builds.last

          if build
            attributes = build.to_hash.merge(
              :number => number,
              :github_payload => payload,
              :compare_url => data.compare,
              :token => token
            )
            repository.builds.create(attributes) unless exclude?(attributes)
          end
        end
      end
    end
  end
end
