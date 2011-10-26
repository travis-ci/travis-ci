require 'github'

module Travis
  module Model
    class Request
      module Payload
        class Github < ::Github::ServiceHook::Payload
          attr_reader :token

          def initialize(payload, token)
            super(payload)
            @token = token
          end

          def attributes
            { :source => source, :payload => payload, :commit => last_commit.to_hash, :token => token }
          end

          def reject?
            repository.private? || skipped? || github_pages?
          end

          protected

            def skipped?
              last_commit.message.to_s =~ /\[ci(?: |:)([\w ]*)\]/i && $1.downcase == 'skip'
            end

            def github_pages?
              last_commit.branch =~ /gh[-_]pages/i
            end
        end
      end
    end
  end
end
