require 'test_helper'
require 'stringio'
require 'stdout_split'

class StdoutSplitTest < Test::Unit::TestCase
  test 'splits stdout' do
    out = StringIO.new('')

    silence_stdout do
      EM.run do
        stream = StdoutSplit.new { |data| out << data }
        EM.defer do
          print '.'
          stream.close
          EM.stop
        end
      end
    end

    assert_equal '.', out.string
  end

  def silence_stdout
    stdout = STDOUT.dup
    dev_null = File.new('/dev/null', 'w+')
    STDOUT.reopen(dev_null)

    yield

    dev_null.close
    STDOUT.reopen(stdout)
  end
end

