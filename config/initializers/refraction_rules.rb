require 'travis'

Refraction.configure do |req|

  if req.host =~ /^#{Regexp.escape(Travis.config.heroku_domain)}$/
    # old heroku address
    Rails.logger.add(1, "\n\nREDIRECT : redirect issued for heroku address\n\n")

    req.permanent! :host => Travis.config.host

    Rails.logger.flush if Rails.logger.respond_to?(:flush)


  # secure.travis-ci.org should be allowed
  elsif req.host == "secure.#{Travis.config.host}"
    # but must be https
    if req.scheme != 'https'
      req.permanent! :scheme => 'https'
    else
      # passthrough
    end


  # we don't want to use www.* for now (or other random names)
  elsif req.host =~ /([-\w]+\.)+#{Regexp.escape(Travis.config.host)}/

    req.permanent! :host => Travis.config.host


  else
    # passthrough with no change
  end

end
