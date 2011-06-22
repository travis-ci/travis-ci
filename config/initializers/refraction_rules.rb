require 'travis'

Refraction.configure do |req|

  if req.host =~ /^#{Regexp.escape(Travis.config["heroku_domain"])}$/
    # old heroku address
    Rails.logger.add(1, "\n\nREDIRECT : redirect issued for heroku address\n\n")

    req.permanent! :host => Travis.config["domain"]

    Rails.logger.flush if Rails.logger.respond_to?(:flush)

  # all requests to secure.travis-ci.org should be https
  elsif req.host == "secure.#{Regexp.escape(Travis.config["domain"])}" && req.scheme != 'https'

    req.permanent! :scheme => 'https'

  # we don't want to use www.* for now (or other random names)
  elsif req.host =~ /([-\w]+\.)+#{Regexp.escape(Travis.config["domain"])}/

    req.permanent! :host => Travis.config["domain"]

  else
    # passthrough with no change
  end

end
