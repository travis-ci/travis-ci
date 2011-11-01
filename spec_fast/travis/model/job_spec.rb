require 'spec_helper'
require 'support/active_record'

describe Job do
  include Support::ActiveRecord

  let!(:job)   { Factory(:test) }

  context :append_log! do
    it 'appends streamed build log chunks' do
      lines = [
        "$ git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n",
        "$ git checkout -qf 662af2708525b776aac580b10cc903ba66050e06\n",
        "$ bundle install --pa"
      ]
      0.upto(2) do |ix|
        job.append_log!(lines[ix])
        job.reload.log.should == lines[0, ix + 1].join
      end
    end
  end
end
