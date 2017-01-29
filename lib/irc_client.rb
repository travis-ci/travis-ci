# based on :
# https://github.com/sr/shout-bot
#
# libs to take note of :
# https://github.com/tbuehlmann/ponder
# https://github.com/cinchrb/cinch
# https://github.com/cho45/net-irc

require "socket"

class IrcClient
  attr_accessor :channel, :socket

  def initialize(server, nick, options = {})
    @socket = TCPSocket.open(server, options[:port] || 6667)
    socket.puts "PASS #{options[:password]}" if options[:password]
    socket.puts "NICK #{nick}"
    socket.puts "USER #{nick} #{nick} #{nick} :#{nick}"
  end

  def join(channel, key = nil)
    self.channel = channel
    socket.puts "JOIN ##{self.channel} #{key}".strip
  end

  def run(&block)
    instance_eval(&block) if block_given?
  end

  def leave
    socket.puts "PART ##{channel}"
  end

  def say(message)
    socket.puts "PRIVMSG ##{channel} :#{message}" if channel
  end

  def quit
    socket.puts "QUIT"
    socket.gets until socket.eof?
  end
end

