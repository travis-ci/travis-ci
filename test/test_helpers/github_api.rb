require 'webmock/test_unit'

module TestHelpers
  module GithubApiTestHelper
    PATHS = %w(
      api/v2/json/repos/show/svenfuchs/gem-release
      api/v2/json/repos/show/travis-ci/travis-ci
      api/v2/json/user/show/svenfuchs
      api/v2/json/organizations/travis-ci/public_members
      api/v2/json/user/show/LTe
    )

    def setup
      super
      PATHS.each do |path|
        filename = File.expand_path("../../fixtures/github/#{path}.json", __FILE__)
        `curl -so #{filename} --create-dirs http://github.com/#{path}` unless File.exists?(filename)
        stub_request(:get, "http://github.com/#{path}").
          to_return(:status => 200, :body => File.read(filename), :headers => {})
      end
    end
  end
end