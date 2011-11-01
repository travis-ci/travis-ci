require 'active_record'
require 'travis/github_api'

class Repository
  module ServiceHook
    def service_hook
      @service_hook ||= ServiceHook.new(self)
    end

    class ServiceHook
      attr_reader :repository

      def initialize(repository)
        @repository = repository
      end

      def set(active, user)
        active ? activate(user) : deactivate(user)
        repository.update_attributes!(:active => active)
      end

      protected

        def activate(user)
          Travis::GithubApi.add_service_hook(repository.owner_name, repository.name, user.github_oauth_token,
            :token  => user.tokens.first.token,
            :user   => user.login,
            :domain => Travis.config.domain
          )
        end

        def deactivate(user)
          Travis::GithubApi.remove_service_hook(repository.owner_name, repository.name, user.github_oauth_token)
        end
    end
  end
end
