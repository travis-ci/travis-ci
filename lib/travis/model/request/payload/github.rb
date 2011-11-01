require 'github'

class Request
  module Payload
    class Github < ::Github::ServiceHook::Payload
      def initialize(data, token)
        super(data)
        self.token = token
      end

      def attributes
        { :source => source, :payload => payload, :commit => last_commit.to_hash, :token => token }
      end

      def reject?
        no_commit? || repository.private? || skipped? || github_pages?
      end

      protected

        def no_commit?
          last_commit.commit.blank?
        end

        def skipped?
          last_commit.message.to_s =~ /\[ci(?: |:)([\w ]*)\]/i && $1.downcase == 'skip'
        end

        def github_pages?
          last_commit.branch =~ /gh[-_]pages/i
        end
    end
  end
end
