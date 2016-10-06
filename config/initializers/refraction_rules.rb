Refraction.configure do |req|
  if req.host =~ /travis\.heroku\.com/
    if req.path =~ /^\/builds/
      # passthrough with no change (old github webhook)
      Rails.logger.add(1, "\n\nPASSTHROUGH : github webhook passthrough on old heroku address\n\n")
    else
      # old heroku address
      Rails.logger.add(1, "\n\nREDIRECT : redirect issued for old heroku address\n\n")
      req.permanent! :host => "travis-ci.org"
    end
    Rails.logger.flush if Rails.logger.respond_to?(:flush)
  elsif req.host =~ /([-\w]+\.)+travis-ci\.org/
    # we don't want to use www for now
    req.permanent! :host => "travis-ci.org"
  else
    # passthrough with no change
  end
end
