Refraction.configure do |req|

  case req.host
  when /travis\.heroku\.com\/builds/
    # passthrough with no change (old github webhook)
  when /travis\.heroku\.com/
    # old heroku address
    req.permanent! :host => "travis-ci.org"
  when /([-\w]+\.)+travis-ci\.org/
    # we don't want to use www for now
    req.permanent! :host => "travis-ci.org"
  else
    # passthrough with no change
  end

end