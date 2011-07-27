class IrcMock
  def initialize
    @output = []
  end

  def join(channel, password = nil, &block)
    @channel = "##{channel}"
    password = password && " #{password}" || ""

    say "JOIN #{@channel}#{password}"

    instance_eval(&block) and leave if block_given?
  end

  def leave
    say "PART #{@channel}"
  end

  def say(message)
    say "PRIVMSG #{@channel} :#{message}" if @channel
  end

  def quit
    say "QUIT"
  end

  def say(output)
    @output << output
  end

  def output
    @output
  end
end