# based on :
# https://github.com/sr/shout-bot
#
# libs to take note of :
# https://github.com/tbuehlmann/ponder
# https://github.com/cinchrb/cinch
# https://github.com/cho45/net-irc
class IrcClient
  attr_accessor :channel

  def initialize(server, nick, options={})
    @socket = TCPSocket.open(server, options[:port] || 6667)
    @socket.puts "PASSWORD #{password}" if options[:password]
    @socket.puts "NICK #{nick}"
    @socket.puts "USER #{nick} #{nick} #{nick} :#{nick}"
  end

  def join(channel, password = nil, &block)
    @channel = "##{channel}"
    password = password && " #{password}" || ""
    @socket.puts "JOIN #{@channel}#{password}"

    instance_eval(&block) and leave if block_given?
  end

  def leave
    @socket.puts "PART #{@channel}"
  end

  def say(message)
    @socket.puts "PRIVMSG #{@channel} :#{message}" if @channel
  end

  def quit
    @socket.puts "QUIT"
    @socket.gets until @socket.eof?
  end
end

