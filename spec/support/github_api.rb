require 'webmock/rspec'

module Support
  module GithubApi
    URLS = %w(
      https://api.github.com/users/svenfuchs/repos
      http://github.com/api/v2/json/repos/show/svenfuchs/gem-release
      http://github.com/api/v2/json/repos/show/svenfuchs/minimal
      http://github.com/api/v2/json/repos/show/travis-ci/travis-ci
      http://github.com/api/v2/json/user/show/svenfuchs
      http://github.com/api/v2/json/organizations/travis-ci/public_members
      http://github.com/api/v2/json/user/show/LTe
    )

    class Requst
      attr_reader :url, :filename

      def initialize(url)
        @url = url
        @filename = "spec/fixtures/github/#{url.gsub(%r(https?://github.com/), '')}.json"
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
        URLS.each { |url| Requst.new(url).stub! }
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
