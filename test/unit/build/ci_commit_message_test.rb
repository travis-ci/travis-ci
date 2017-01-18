require 'test_helper'

class CiCommitMessageTest < ActiveSupport::TestCase
  include TestHelpers::GithubApiTestHelper

  def payload_with_custom_message_addition(message)
    payload = GITHUB_PAYLOADS['travis-ci']

    payload = ActiveSupport::JSON.decode(payload)

    payload['commits'].first['message'] += message

    ActiveSupport::JSON.encode(payload)
  end

  test '#exclude? : returns true when the commit message includes [ci skip]' do
    attributes = { :message => 'lets party like its 1999 [ci skip]' }
    assert Build.exclude?(attributes)
  end

  test '#exclude? : returns true when the commit message includes [CI SKIP]' do
    attributes = { :message => 'lets party like its 1999 [CI SKIP]' }
    assert Build.exclude?(attributes)
  end

  test '#exclude? : returns false when the commit message includes [ci not-valid-command]' do
    attributes = { :message => 'lets party like its 1999 [ci not-valid-command]' }
    assert !Build.exclude?(attributes)
  end

  test 'a Github payload containing [ci skip] in the commit message does not create a build' do
    payload = payload_with_custom_message_addition(' [ci skip]')
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(payload, 'abc')
    end
  end

  test 'a Github payload containing [CI skip] in the commit message does not create a build' do
    payload = payload_with_custom_message_addition(' [CI skip]')
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(payload, 'abc')
    end
  end

  test 'a Github payload containing [CI not-valid-command] in the commit message does create a build' do
    payload = payload_with_custom_message_addition(' [CI not-valid-command]')
    assert_difference('Build.count', 1) do
      Build.create_from_github_payload(payload, 'abc')
    end
  end
end
