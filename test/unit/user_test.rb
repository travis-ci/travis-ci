require 'test_helper'

class UserTest < ActiveSupport::TestCase

  test 'profile_image_hash returns a MD5 hash of the email if an email is set' do
    user         = Factory.build(:user)
    hashed_email = Digest::MD5.hexdigest(user.email)

    assert_equal hashed_email, user.profile_image_hash
  end

  test 'profile_image_hash returns 32 zeros if no email is set' do
    user       = Factory.build(:user)
    user.email = nil

    assert_equal '0' * 32, user.profile_image_hash
  end

  test 'user_data_from_github_data returns required data' do
    github_data = {
      'uid' => '234423',
      'user_info' => {
        'name' => 'J User',
        'nickname' => 'j_user' ,
        'email' => 'j_user@email.com'
      },
      'credentials' => {
        'token' => '1234567890abcdefg'
      },
      'company' => 'ACME'
    }

    returned_data = {
      'name'  => 'J User',
      'email' => 'j_user@email.com',
      'login' => 'j_user',
      'github_id' => '234423',
      'github_oauth_token' => '1234567890abcdefg'
    }

    assert_equal returned_data , User::user_data_from_github_data(github_data)
  end

end
