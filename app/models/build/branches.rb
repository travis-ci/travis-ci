class Build
  module Branches
    def branch_included?
      included_branches.include?(branch)
    end

    def branch_excluded?
      excluded_branches.include?(branch)
    end

    def included_branches
      branches_config['only'] || []
    end

    def excluded_branches
      branches_config['except'] || []
    end

    def branches_config
      case config && config['branches']
      when String
        { 'only' => config['branches'].split(',').map(&:strip) }
      when Array
        { 'only' => config['branches'] }
      when Hash
        config['branches']
      else
        {}
      end
    end
  end
end
