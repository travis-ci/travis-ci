require 'test_helper'
require 'stringio'
require 'travis/stream_stdout'

class TravisStreamStdoutTest < Test::Unit::TestCase
  test 'duplicates stdout' do
    out = StringIO.new('')

    silence_stdout do
      EM.run do
        stream = Travis::StreamStdout.new { |data| out << data }
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

