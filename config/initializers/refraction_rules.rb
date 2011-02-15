Refraction.configure do |req|

  case req.host
  when /travis\.heroku\.com\/builds/
    # passthrough with no change (old github webhook)
  when /([-\w]+\.)+travis-ci\.org/
    req.permanent! :host => "travis-ci.org"
  else
    # passthrough with no change
  end

end