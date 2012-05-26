class ApiConstraints
  def initialize(options)
    @version = options[:version]
    @default = options[:default]
  end

  def matches?(req)
    p req
    @default || req.headers['Accept'].include?("application/vnd.travis-ci.org; version=#{@version}")
  end
end
