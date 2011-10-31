require 'spec_helper'
require 'action_mailer'
require 'support/factories'
require 'support/matchers'

describe Travis::Mailer::Build do
  let(:build)       { Factory(:build, :state => :finished, :started_at => Time.utc(2011, 6, 23, 15, 30, 45), :finished_at => Time.utc(2011, 6, 23, 16, 47, 52)) }
  let(:recipients)  { ['owner@example.com', 'committer@example.com', 'author@example.com'] }

  before { Travis::Mailer.setup }

  describe 'finished build email notification' do
    let(:email) { Travis::Mailer::Build.send(:finished_email, build, recipients) }

    it 'delivers to the repository owner, committer and commit author' do
      email.should deliver_to(recipients)
    end

    it 'uses the expected subject' do
      email.subject.should == '[Failed] svenfuchs/minimal#1 (master - 62aae5f)'
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
  end
end


