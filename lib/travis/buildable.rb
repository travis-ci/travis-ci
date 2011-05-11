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
        status = (install? ? install && run_scripts : run_scripts) ? 0 : 1
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
        File.exists?(config.gemfile)
      end

      def install
        execute prepend_env("bundle install #{config['bundler_args'] if config.has_key?('bundler_args')}")
      end
  
      def run_scripts
        %w{before_script script after_script}.each do |script_type|
          break false unless run_script(script_type)
        end
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
            "BUNDLE_GEMFILE=#{File.expand_path(value.to_s)}"
          when 'env'
            value
          end
        end.compact
      end

      def script(type)
        config[type] || instance_variable_get(:"@#{type}")
      end

      def run_script(type)
        script = self.script(type)
        return true if script.nil?
         
        Array(script).each do |arg|
          break false unless execute prepend_env(arg) 
        end
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

      # This wraps the user's build script so that
      #
      # 1. every command line (e.g. `rake test`) is preceeded by a line that echos that line (e.g. `echo rake\ test`)
      # 2. the rvm script is sourced before running anything else
      # 3. the whole thing is wrapped into bash -c to ensure we're using bash
      #
      # Instead of quoting the user's build script once for echo'ing and another time for passing it to bash -c
      # we're shell-escaping it. This way the command is agnostic about quotes the user script might contain.
      def execute(cmd)
        cmd = "source ~/.rvm/scripts/rvm\n#{echoize(cmd)}"
        cmd = "bash -c #{Shellwords.escape("#{cmd} 2>&1")}"
        system(cmd)
      end

      def echoize(cmd)
        cmd = [cmd].flatten.join("\n").split("\n")
        cmd.map { |cmd| "echo #{Shellwords.escape("$ #{cmd}")}\n#{cmd}" }.join("\n")
      end
  end
end
