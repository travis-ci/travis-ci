# require 'webmock/test_unit'
require 'fakeweb'

module GithubApiTestHelper
  PATHS = %w(
    api/v2/json/repos/show/svenfuchs/gem-release
    api/v2/json/repos/show/travis-ci/travis-ci
    api/v2/json/user/show/svenfuchs
    api/v2/json/organizations/travis-ci/public_members
  )

  def setup
    super
    PATHS.each do |path|
      filename = File.expand_path("../../fixtures/github/#{path}.json", __FILE__)
      `curl -so #{filename} --create-dirs http://github.com/#{path}` unless File.exists?(filename)
      FakeWeb.register_uri(:get, "http://github.com/#{path}", :body => File.read(filename))
    end
  end
end
