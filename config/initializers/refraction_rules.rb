Refraction.configure do |req|

  case req.host
  when /travis\.heroku\.com\/builds/
    # passthrough with no change (old github webhook)
    Rails.logger.add(:info, "github webhook passthrough on old heroku address")
  when /travis\.heroku\.com/
    # old heroku address
    Rails.logger.add(:info, "redirect issued for old heroku address")
    req.permanent! :host => "travis-ci.org"
  when /([-\w]+\.)+travis-ci\.org/
    # we don't want to use www for now
    req.permanent! :host => "travis-ci.org"
  else
    # passthrough with no change
  end

end