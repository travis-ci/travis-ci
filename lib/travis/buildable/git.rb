module Travis
  module Buildable
    class Git < Base
      def checkout
        execute "mkdir -p #{build_dir}"
        Dir.chdir(build_dir) do
          git? ? fetch : clone
          # execute "git checkout #{commit}"
        end
      end

      def git?
        ::File.exist?("#{build_dir}/.git")
      end

      def clone
        execute "git clone #{git_uri}"
      end

      def fetch
        execute 'git clean -fdx'
        execute 'git fetch'
      end

      def git_uri
        "git://#{uri}.git"
      end
    end
  end
end

