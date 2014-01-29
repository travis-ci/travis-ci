class ApiConstraints
  attr_reader :options

  def initialize(options)
    @options = options
  end

  def matches?(request)
    default? || matches_accept_header?(request) || matches_query_param?(request)
  end

  private

    def default?
      !!options[:default]
    end

    def matches_accept_header?(request)
      accept_header = request.headers['Accept']
      accept_header && accept_header.include?("application/vnd.travis-ci.#{version}+json")
    end

    def matches_query_param?(request)
      request.params[:version].try(:to_i) == version.to_i
    end

    def version
      options[:version]
    end
end
