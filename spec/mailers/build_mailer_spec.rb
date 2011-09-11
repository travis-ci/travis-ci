require 'spec_helper'

describe BuildMailer do
  describe 'finished_email' do
    let(:mail)  { BuildMailer.finished_email(build) }

    describe 'for a successful build' do
      let(:build) { Factory(:successful_build) }

      it 'subject' do
        mail.subject.should == '[Passed] svenfuchs/successful_build#1 (master - 62aae5f)'
      end

      it 'recipient' do
        mail.to.should == ['svenfuchs@artweb-design.de']
      end

      it 'sender' do
        mail.from.should == ['notifications@travis-ci.org']
      end

      it 'displays the build number' do
        mail.body.encoded.should include(build.number.to_s)
      end

      it 'displays the status message' do
        mail.body.encoded.should include(build.status_message)
      end

      it 'is a multipart email' do
        mail.should be_multipart
      end

      context 'in HTML' do
        it 'escapes newlines in the commit message' do
          build.commit.message = "bar\nbaz"
          mail.body.encoded.should include("bar<br />baz")  # premailer converts <br> to <br />
        end

        it 'inlines css' do
          mail.body.encoded.should include('<div style="')
        end

        it 'should have the "success" css class on alert-message' do
          mail.body.encoded.should include('<div class="alert-message block-message success"')
        end
      end
    end

    describe 'for a broken build' do
      let(:build) { Factory(:broken_build) }

      it 'subject' do
        mail.subject.should == '[Failed] svenfuchs/broken_build#1 (master - 62aae5f)'
      end

      it 'recipient' do
        mail.to.should == ['svenfuchs@artweb-design.de']
      end

      it 'sender' do
        mail.from.should == ['notifications@travis-ci.org']
      end

      it 'displays the build number' do
        mail.body.encoded.should include(build.number.to_s)
      end

      it 'displays the status message' do
        mail.body.encoded.should include(build.status_message)
      end

      it 'is a multipart email' do
        mail.should be_multipart
      end

      context 'in HTML' do
        it 'should have the "error" css class on alert-message' do
          mail.body.encoded.should include('<div class="alert-message block-message error"')
        end
      end
    end
  end
end

