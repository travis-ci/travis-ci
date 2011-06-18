require 'travis'

module Travis
  module GitHubApi
    class ServiceHookError < StandardError; end

    class << self
      # an error is thrown if there was a probem subscribing
      def add_service_hook(repository, user)
        client = Octokit::Client.new(:oauth_token => user.github_oauth_token)

        client.subscribe_service_hook(repository.owner_name, repository.name, "Travis", {
          :token  => user.tokens.first.token,
          :user   => user.login,
          :domain => Travis.config['domain']
        })
      rescue Octokit::UnprocessableEntity => e
        # we might want to improve this for logging purposes
        raise ServiceHookError, 'error subscribing to the GitHub push event'
      end
    end

  end
end