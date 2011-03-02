require 'fileutils'
require 'uri'
require 'travis/buildable/config'

module Travis
  class Buildable
    autoload :Config, 'travis/buildable/config'

    class << self
      def base_dir
        @@base_dir ||= '/tmp/travis/builds'
      end

      def base_dir=(base_dir)
        @@base_dir = base_dir
      end
    end

    attr_reader :url, :path, :commit

    def initialize(build)
      @url    = build[:url] || raise(ArgumentError.new('no url given'))
      @commit = build[:commit]
      @script = build[:script]
      @path   = extract_path(url)
    end

    def run!
      Bundler.with_clean_env do
        ENV['BUNDLE_GEMFILE'] = nil
        chdir do
          exists? ? fetch : clone
          checkout
          config.configure? ? configure! : build!
        end
      end
    end

    protected
      def configure!
        { 'config' => config }
      end

      def build!
        install
        status = run_script
        { 'status' => status }
      end

      def clone
        execute "cd ..; git clone #{git_url}; cd -"
      end

      def fetch
        execute 'git clean -fdx'
        execute 'git fetch'
      end

      def checkout
        execute "git checkout -qf #{commit}" if commit
      end

      def install
        execute 'bundle install'
      end

      def run_script
        execute(script).tap do |status|
          puts "\nDone. Build script exited with: #{status}"
        end
      end

      def script
        config[:script] || @script
      end

      def config
        @config ||= Config.new(config_url)
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

      def config_url
        @config_url ||= File.expand_path(".travis.yml")
      end

      def git_url
        url[0..6] == 'file://' ? path : "#{url.gsub(%r(http://|https://), 'git://')}.git"
      end

      def extract_path(url)
        if url =~ %r(https?://github.com)
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
