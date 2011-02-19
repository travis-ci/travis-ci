require 'test_helper'
require 'stringio'
require 'em/stdout'

class EMStdoutTest < Test::Unit::TestCase
  test 'splits stdout' do
    out = StringIO.new('')
    EM::Stdout.output = false

    EM.run do
      EM.defer do
        EM.split_stdout do |c|
          c.callback { |data| out << data }
        end
        print '.'
        EM.stop
      end
    end

    assert_equal '.', out.string
  end
end
