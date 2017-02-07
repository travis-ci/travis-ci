require 'spec_helper'
require 'irc_client'

describe IrcClient do
  
  let(:socket) { stub(:puts => true, :get => true, :eof? => true) }
  let(:server) { 'irc.freenode.net' }
  let(:nick) { 'travis_bot' }
  let(:channel) { 'travis' }
  let(:password) { 'secret' }
  
  describe 'on initialization' do

    describe 'with no port specified' do
      it 'should open a socket on the server for port 6667' do
        TCPSocket.expects(:open).with(server, 6667).returns socket
        IrcClient.new(server, nick)
      end
    end

    describe 'with port specified' do
      it 'should open a socket on the server for the given port' do
        TCPSocket.expects(:open).with(server, 1234).returns socket
        IrcClient.new(server, nick, :port => 1234)
      end
    end

    describe 'should connect to the server' do

      before do
        @socket = mock
        TCPSocket.stubs(:open).returns @socket
      end

      def expect_standard_sequence
        @socket.expects(:puts).with("NICK #{nick}")
        @socket.expects(:puts).with("USER #{nick} #{nick} #{nick} :#{nick}")
      end
      
      describe 'without a password' do
        it 'by sending NICK then USER' do
          expect_standard_sequence
          IrcClient.new(server, nick)
        end
      end

      describe 'with a password' do
        it 'by sending PASS then NICK then USER' do
          @socket.expects(:puts).with("PASS #{password}")
          expect_standard_sequence
          IrcClient.new(server, nick, :password => password)
        end
      end

    end

  end

  describe 'with connection established' do

    let(:socket) { stub(:puts => true) }
    let(:channel_key) { 'mykey' }

    before(:each) do
      TCPSocket.stubs(:open).returns socket
      @client = IrcClient.new(server, nick)
    end

    it 'can join a channel' do      
      socket.expects(:puts).with("JOIN ##{channel}")
      @client.join(channel)      
    end

    it 'can join a channel with a key' do      
      socket.expects(:puts).with("JOIN ##{channel} mykey")
      @client.join(channel, 'mykey')      
    end
    
    describe 'and channel joined' do
      before(:each) do
        @client.join(channel)
      end
      it 'can leave the channel' do
        socket.expects(:puts).with("PART ##{channel}")
        @client.leave
      end
      it 'can message the channel' do
        socket.expects(:puts).with("PRIVMSG ##{channel} :hello")
        @client.say 'hello'
      end
    end
    
    it 'can run a series of commands' do
      socket.expects(:puts).with("JOIN #travis")
      socket.expects(:puts).with("PRIVMSG #travis :hello")
      socket.expects(:puts).with("PRIVMSG #travis :goodbye")
      socket.expects(:puts).with("PART #travis")
      
      @client.run do
        join 'travis'
        say 'hello'
        say 'goodbye'
        leave
      end
    end

    it 'can abandon the connection' do
      socket.expects(:puts).with("QUIT")
      socket.expects(:eof?).returns true
      @client.quit
    end
        
  end
end

