require 'spec_helper'

describe BuildMailer do
  describe 'finished_email' do
    let(:build) { Factory(:successfull_build) }
    let(:mail)  { BuildMailer.finished_email(build) }

    it 'subject' do
      mail.subject.should == "[Passed] svenfuchs/successfull_build#1 (master - 62aae5f)"
    end

    it 'recipient' do
      mail.to.should == ["svenfuchs@artweb-design.de"]
    end

    it 'sender' do
      mail.from.should == ["notifications@travis-ci.org"]
    end

    it 'displays the build number' do
      mail.body.encoded.should include(build.number.to_s)
    end

    it 'displays the status message' do
      mail.body.encoded.should include(build.status_message)
    end
  end
end
