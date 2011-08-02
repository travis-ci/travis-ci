require 'github'

class Request
  module Github
    extend ActiveSupport::Concern

    class << self
      def reject?(repository, commit)
        repository.private? || commit.branch.match(/gh[-_]pages/i)
      end
    end

    module ClassMethods
      def create_from_github_payload(payload, token)
        data = ::Github::ServiceHook::Payload.new(payload)
        commit = data.commits.last

        if commit && !Github.reject?(data.repository, commit)
          attributes = { :source => :github, :payload => payload, :commit => Commit.create!(commit.to_hash) }
          repository = Repository.find_or_create_by_github_repository(data.repository)
          repository.requests.create!(attributes)
        end
      end
    end
  end
end
