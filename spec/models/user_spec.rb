require 'spec_helper'

describe User do
  let (:user)    { FactoryGirl.build(:user) }
  let (:payload) { GITHUB_PAYLOADS[:oauth] }
  let (:updated_payload) { GITHUB_PAYLOADS[:oauth_updated] }

  describe 'find_or_create_for_oauth' do
    def user(payload)
      User.find_or_create_for_oauth(payload)
    end

    it 'marks new users as such' do
      user(payload).should be_recently_signed_up
      user(payload).should_not be_recently_signed_up
    end

    it 'updates changed attributes' do
      user(payload)
      user(updated_payload).login.should == 'johnathan'
    end
  end

  describe 'user_data_from_oauth' do
    it 'returns required data' do
      User.user_data_from_oauth(payload).should == {
        'name'  => 'John',
        'email' => 'john@email.com',
        'login' => 'john',
        'github_id' => '234423',
        'github_oauth_token' => '1234567890abcdefg'
      }
    end
  end

  describe 'profile_image_hash' do
    it 'returns a MD5 hash of the email if an email is set' do
      user.profile_image_hash.should == Digest::MD5.hexdigest(user.email)
    end

    it 'returns 32 zeros if no email is set' do
      user.email = nil
      user.profile_image_hash.should == '0' * 32
    end
  end

  xit 'github_repositories should be specified'
end
