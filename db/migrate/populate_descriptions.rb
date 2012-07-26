require File.expand_path('config/environment')
require 'github'

class RateLimit < Exception
end

module Github
  module Api
    def fetch
      uri = URI.parse("http://github.com/api/v2/json/#{path}")
      response = Net::HTTP.get_response(uri)
      raise RateLimit if response.body.include?('API Rate Limit Exceeded')
      data = ActiveSupport::JSON.decode(response.body)
      key  = self.class.name.demodulize.underscore
      data.replace(data[key]) if data.key?(key)
      self.class.new(data)
    end
  end
end

Repository.where(description: nil).each do |r|
  begin
    repository = Github::Repository.fetch(owner: r.owner_name, name: r.name)
    puts "#{r.owner_name}/#{r.name}: #{repository.description}"
    r.update_attribute(:description, repository.description)
  rescue RateLimit
    1.upto(60) { sleep(1); print('.') }
    puts
    retry
  end
end

Build.where(language: nil).each do |build|
  build.update_attribute(:language, build.config[:language] || 'ruby')
end

Repository.where(last_build_language: nil).each do |repository|
  repository.update_attribute(:last_build_language, repository.last_build.try(:language) || 'ruby')
end

