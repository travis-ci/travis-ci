require 'rubygems'
require 'eventmachine'
require 'json'

$stdout.sync = true

class ReadFromWorker < EventMachine::Connection
  def buffer
    @buffer ||= BufferedTokenizer.new("\n")
  end

  def receive_data(data)
    print data
    return
    buffer.extract(data).each do |line|
      begin
        data = JSON.parse(data)
        # process by data['worker_id'] and data['build_id']
        print data['msg'] if data['msg']
      rescue
      end
    end
  end
end

EM.run do
  EM.start_server('127.0.0.1', 9797, ReadFromWorker)
end
