class Request
  module Branches
    def branch_included?
      !included_branches || included_branches.include?(commit.branch)
    end

    def branch_excluded?
      excluded_branches && excluded_branches.include?(commit.branch)
    end

    def included_branches
      branches_config[:only]
    end

    def excluded_branches
      branches_config[:except]
    end

    def branches_config
      case config.try(:[], :branches)
      when String
        { :only => config[:branches].split(',').map(&:strip) }
      when Array
        { :only => config[:branches] }
      when Hash
        config[:branches]
      else
        {}
      end
    end
  end
end
