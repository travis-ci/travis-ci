require 'fileutils'
require 'uri'

module Travis
  class Buildable
    class << self
      def base_dir
        @@base_dir ||= '/tmp/travis/builds'
      end

      def base_dir=(base_dir)
        @@base_dir = base_dir
      end
    end

    attr_reader :uri, :path, :commit, :script

    def initialize(uri, options = {})
      @uri    = uri || raise(ArgumentError.new('no uri given'))
      @path   = extract_path(uri)
      @commit = options['commit']
      @script = options['script']
    end

    def build
      chdir do
        exists? ? fetch : clone
        execute "git checkout -q #{commit}" if commit
        execute(script)
      end
    end

    protected

      def clone
        execute "git clone #{git_uri} ."
      end

      def fetch
        execute 'git clean -fdx'
        execute 'git fetch'
      end

      def chdir(&block)
        FileUtils.mkdir_p(build_dir)
        Dir.chdir(build_dir, &block)
      end

      def exists?
        ::File.exist?("#{build_dir}/.git")
      end

      def build_dir
        @build_dir ||= begin
          base = ::File.dirname(path).gsub(/\W/, '_').sub(/^_/, '')
          base.gsub!('__', '_') while base.include?('__')
          "#{Buildable.base_dir}/#{base}/#{::File.basename(path)}"
        end
      end

      def git_uri
        uri[0..6] == 'file://' ? path : "#{uri.gsub('http://', 'git://')}.git"
      end

      def extract_path(uri)
        if uri[0..16] == 'http://github.com'
          URI.parse(uri).path
        elsif uri =~ %r(file://)
          File.expand_path(uri.gsub('file://', ''))
        else
          raise "unsupported uri #{uri}"
        end
      end

      def execute(command)
        puts "$ #{command}"
        system(command)
      end
  end
end
