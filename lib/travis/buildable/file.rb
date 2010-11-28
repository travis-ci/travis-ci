module Travis
  module Buildable
    class File < Base
      def checkout
        raise 'wrong build directory' unless build_dir[0..4] == '/tmp/'
        execute "rm -rf #{build_dir}"
        execute "mkdir -p #{build_dir}"
        execute "git clone #{::File.expand_path(uri)} #{build_dir}"
      end
    end
  end
end
