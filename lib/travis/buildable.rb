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

    attr_reader :url, :path, :commit, :script

    def initialize(script, build)
      @url    = build[:url] || raise(ArgumentError.new('no url given'))
      @commit = build[:commit]
      @path   = extract_path(url)
      @script = script
    end

    def build!
      chdir do
        exists? ? fetch : clone
        execute "git checkout -q #{commit}" if commit
        execute "BUNDLE_GEMFILE='./Gemfile' #{script}"
      end
    end

    protected

      def clone
        execute "git clone #{git_url} ."
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

      def git_url
        url[0..6] == 'file://' ? path : "#{url.gsub('http://', 'git://')}.git"
      end

      def extract_path(url)
        if url[0..16] == 'http://github.com'
          URI.parse(url).path
        elsif url =~ %r(file://)
          File.expand_path(url.gsub('file://', ''))
        else
          raise "unsupported url #{url}"
        end
      end

      def execute(command)
        puts "$ #{command}"
        system("#{command} 2>&1") ? 0 : 1
      end
  end
end
