require 'faraday'
require 'json'

class RateLimitExceeded < Exception; end

slugs = `heroku console 'Repository.order(:url).all.each { |r| puts r.slug } && nil' --remote production`.gsub(/\nnil$/, '').split("\n")
data  = slugs.map do |slug|
  begin
    print "fetching stats for #{slug} ... "
    response = Faraday.get("http://github.com/api/v2/json/repos/show/#{slug}")
    body     = JSON.parse(response.body) rescue {}
    if response.success?
      puts ''
      [slug, body['repository']['watchers']]
    else
      error = Array(body['error']).join
      puts "#{response.status}: #{error}"
      raise(RateLimitExceeded) if error.include?('Rate Limit Exceeded')
      [slug, -1]
    end
  rescue RateLimitExceeded
    puts "Waiting for 60 seconds."
    1.upto(60) do |i|
      print "#{i}\r"
      sleep(1)
    end
    retry
  end
end

data.sort! { |lft, rgt| lft.last <=> rgt.last }

data.each do |slug, watchers|
  puts "#{watchers} #{slug}"
end

