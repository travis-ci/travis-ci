require 'test_helper'

class UserTest < ActiveSupport::TestCase
  OAUTH_PAYLOAD = {
    'uid' => '234423',
    'user_info' => {
      'name' => 'John',
      'nickname' => 'john',
      'email' => 'john@email.com'
    },
    'credentials' => {
      'token' => '1234567890abcdefg'
    }
  }

  test 'profile_image_hash returns a MD5 hash of the email if an email is set' do
    user         = FactoryGirl.build(:user)
    hashed_email = Digest::MD5.hexdigest(user.email)

    assert_equal hashed_email, user.profile_image_hash
  end

  test 'profile_image_hash returns 32 zeros if no email is set' do
    user       = FactoryGirl.build(:user)
    user.email = nil

    assert_equal '0' * 32, user.profile_image_hash
  end

  test 'user_data_from_oauth returns required data' do
    expected = {
      'name'  => 'John',
      'email' => 'john@email.com',
      'login' => 'john',
      'github_id' => '234423',
      'github_oauth_token' => '1234567890abcdefg'
    }
    assert_equal expected , User.user_data_from_oauth(OAUTH_PAYLOAD)
  end

  test 'new users are marked as such' do
    user = User.find_or_create_for_oauth(OAUTH_PAYLOAD)
    assert user.recently_signed_up?, "user should have just signed up"

    user = User.find_or_create_for_oauth(OAUTH_PAYLOAD)
    assert !user.recently_signed_up?, "user should already exist"
  end

end
