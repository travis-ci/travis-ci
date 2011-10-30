require 'webmock/rspec'

module Support
  module GithubApi
    URLS = %w(
      https://api.github.com/users/svenfuchs
      https://api.github.com/users/svenfuchs/repos
      https://api.github.com/repos/svenfuchs/gem-release
      https://api.github.com/repos/travis-ci/travis-ci
      https://github.com/api/v2/json/organizations/travis-ci/public_members
    )

    class MockRequest
      attr_reader :url, :filename

      def initialize(url)
        @url = url
        @filename = "spec/fixtures/github/#{url.gsub(%r(https?://(api\.)?github.com/), '')}.json"
      end

      def stub!
        WebMock.stub_request(:get, url).to_return(:status => 200, :body => body, :headers => {})
      end

      def body
        store unless stored?
        File.read(filename)
      end

      def store
        puts "Storing #{url} to #{filename}."
        `curl -so #{filename} --create-dirs #{url}`
      end

      def stored?
        File.exists?(filename)
      end
    end

    class << self
      def mock!
        URLS.each { |url| MockRequest.new(url).stub! }
      end
    end

    def mock_github_api
      Support::GithubApi.mock!
    end

    def stub_github_api_post
      url = 'https://api.github.com/hub?access_token=github_oauth_token'
      stub_request(:post, url).to_return(:status => 200, :body => '')
    end
  end
end
