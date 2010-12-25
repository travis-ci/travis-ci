require 'test_helper'
require 'stringio'
require 'em/stdout'

class EMStdoutTest < Test::Unit::TestCase
  test 'splits stdout' do
    out = StringIO.new('')
    EM::Stdout.output = false

    EM.run do
      stream = EM::Stdout.new { |data| out << data }
      EM.defer do
        print '.'
        stream.close
        EM.stop
      end
    end

    assert_equal '.', out.string
  end
end

