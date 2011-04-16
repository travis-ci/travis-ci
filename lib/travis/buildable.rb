require 'shellwords'
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

    def initialize(options = {})
      @url    = options[:url] || ''
      @commit = options[:commit]
      @script = options[:script]
      @config = Config.new(options[:config]) unless options[:config].blank?
      @path   = extract_path(url)
    end

    def run!
      Bundler.with_clean_env do
        ENV['BUNDLE_GEMFILE'] = nil
        chdir do
          checkout
          config.configure? ? configure! : build!
        end
      end
    end

    protected
      def configure!
        config
      end

      def build!
        status = (install? ? install && run_script : run_script) ? 0 : 1
        puts "\nDone. Build script exited with: #{status}"
        status
      end

      def checkout
        exists? ? fetch : clone
        execute "git checkout -qf #{commit}" if commit
      end

      def clone
        execute "cd ..; git clone #{git_url}; cd -"
      end

      def fetch
        execute 'git clean -fdx'
        execute 'git fetch'
      end

      def install?
        File.exists?('Gemfile')
      end

      def install
        execute prepend_env('bundle install')
      end

      def run_script
        execute prepend_env(script)
      end

      def prepend_env(command)
        command = [(env + [command]).join(' ')]
        command.unshift("rvm use #{config['rvm']}") if config['rvm']
        command
      end

      def env
        @env ||= (Config::ENV_KEYS - ['rvm']).map do |key|
          next unless value = config[key]
          case key
          when 'gemfile'
            "BUNDLE_GEMFILE=#{value}"
          when 'env'
            value
          end
        end.compact
      end

      def script
        config['script'] || @script
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
          ''
        end
      end

      def execute(cmd)
        cmd = "source ~/.rvm/scripts/rvm\n#{echoize(cmd)}"
        cmd = "bash -c #{Shellwords.escape(cmd)}" # use shell escaping so we're agnostic about quotes that users might use in their scripts
        system(cmd)
      end

      def echoize(cmd)
        cmd = [cmd].flatten.join("\n").split("\n")
        cmd.map { |cmd| "echo #{Shellwords.escape("$ #{cmd}")}\n#{cmd}" }.join("\n")
      end
  end
end
