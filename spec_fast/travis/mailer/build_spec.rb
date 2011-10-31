require 'spec_helper'
require 'action_mailer'
require 'support/active_record'
require 'support/matchers'

describe Travis::Mailer::Build do
  include Support::ActiveRecord

  let(:build)      { Factory(:build, :state => :finished, :started_at => Time.utc(2011, 6, 23, 15, 30, 45), :finished_at => Time.utc(2011, 6, 23, 16, 47, 52)) }
  let(:recipients) { ['owner@example.com', 'committer@example.com', 'author@example.com'] }
  let(:email)      { Travis::Mailer::Build.finished_email(build, recipients) }

  before :each do
    Travis::Mailer.setup
    ActionMailer::Base.delivery_method = :test
  end

  describe 'finished build email notification' do

    it 'delivers to the repository owner, committer and commit author' do
      email.should deliver_to(recipients)
    end

    it 'is a multipart email' do
      email.should be_multipart
    end

    it 'contains the expected text part' do
      email.text_part.body.should include_lines(%(
        Build : #1
        Duration : 1 hour, 17 minutes, and 7 seconds
        Commit : 62aae5f7 (master)
        Author : Sven Fuchs
        Message : the commit message
        Status : Failed
        View the changeset : https://github.com/svenfuchs/minimal/compare/master...develop
        View the full build log and details : http://travis-ci.org/svenfuchs/minimal/builds/#{build.id}
      ))
    end

    it 'contains the expected html part' do
      email.text_part.body.should include_lines(%(
        1 hour, 17 minutes, and 7 seconds
        62aae5f7 (master)
        Author
        the commit message
        Failed
        View the changeset
        https://github.com/svenfuchs/minimal/compare/master...develop
        View the full build log and details
        http://travis-ci.org/svenfuchs/minimal/builds/#{build.id}
      ))
    end

    context 'in HTML' do
      it 'escapes newlines in the commit message' do
        build.commit.message = "bar\nbaz"
        email.deliver # inline css interceptor is called before delivery.
        email.html_part.decoded.should include("bar<br />baz")  # premailer converts <br> to <br />
      end

      it 'inlines css' do
        email.deliver
        email.html_part.decoded.should include('<div style="')
      end
    end
  end

  describe 'finished_email' do
    describe 'for a successful build' do
      let(:build) { Factory(:successful_build) }

      it 'subject' do
        email.subject.should == '[Passed] svenfuchs/successful_build#1 (master - 62aae5f)'
      end

      it 'should have the "success" css class on alert-message' do
        email.deliver
        email.html_part.decoded.should include('<div class="alert-message block-message success"')
      end
    end

    describe 'for a broken build' do
      let(:build) { Factory(:broken_build) }

      it 'subject' do
        email.subject.should == '[Failed] svenfuchs/broken_build#1 (master - 62aae5f)'
      end

      it 'should have the "error" css class on alert-message' do
        email.deliver
        email.html_part.decoded.should include('<div class="alert-message block-message error"')
      end
    end
  end
end
