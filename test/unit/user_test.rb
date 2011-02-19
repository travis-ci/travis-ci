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
end
