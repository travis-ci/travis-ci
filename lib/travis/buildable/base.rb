require 'POpen4'

module Travis
  module Buildable
    class Base
      attr_reader :uri, :options, :logger

      def initialize(uri, options, &block)
        @uri     = uri
        @options = options
        @logger  = block
      end

      def build(script)
        checkout
        Dir.chdir(build_dir) do
          execute(script)
        end
      end

      def log(message)
        logger.call(message)
      end

      def build_dir
        "/tmp/travis/builds/#{build_path}"
      end

      def build_path
        @build_path ||= begin
          base = ::File.dirname(uri).gsub(/\W/, '_').sub(/^_/, '')
          base.gsub!('__', '_') while base.include?('__')
          "#{base}/#{::File.basename(uri)}"
        end
      end

      def execute(command)
        log("$ #{command}\n")
        POpen4::popen4("#{command} 2>&1") do |stdout, stderr, stdin, pid|
          begin
            loop do
              # does this block? and if so, what's a better solution? i have no idea ...
              IO.select([stdout]).flatten.compact.each do |io|
                log(io.readpartial(1024)) if io.fileno == stdout.fileno
              end
              break if stdout.closed?
            end
          rescue EOFError
          end
        end
      end
    end
  end
end

