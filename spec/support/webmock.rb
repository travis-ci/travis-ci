require 'travis/testing/webmock'

Support::Webmock.urls = %w(
  https://api.github.com/users/svenfuchs
  https://api.github.com/users/svenfuchs/repos?per_page=9999
  https://github.com/api/v2/json/repos/show/svenfuchs
  http://github.com/api/v2/json/repos/show/svenfuchs/gem-release
  http://github.com/api/v2/json/repos/show/svenfuchs/minimal
  http://github.com/api/v2/json/repos/show/travis-ci/travis-ci
  http://github.com/api/v2/json/user/show/svenfuchs
  http://github.com/api/v2/json/organizations/travis-ci/public_members
  http://github.com/api/v2/json/user/show/LTe
)
