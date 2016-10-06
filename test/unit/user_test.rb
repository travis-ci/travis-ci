require 'test_helper_rails'

class UserTest < ActiveSupport::TestCase
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

  test 'user_data_from_github_data returns required data' do
    github_data = {'name' => 'j_user', 'login' => 'j_user' , 'email' => 'j_user@email.com' , 'company' => 'ACME', 'id' => '234423'}
    returned_data = {'name' => 'j_user', 'login' => 'j_user' , 'email' => 'j_user@email.com', 'github_id' => '234423' }

    assert_equal returned_data , User::user_data_from_github_data(github_data)

  end

end
