class Forgery::Repository < Forgery
  def self.owner_name
    dictionaries[:owners].random
  end
  def self.owner_email
    dictionaries[:owner_emails].random
  end
  def self.url
    dictionaries[:repository_urls].random
  end
  def self.name
    dictionaries[:repository_names].random
  end
  def self.time from = 0.0, to = ::Time.now
    ::Time.at(from + rand * (to.to_f - from.to_f))
  end
  def self.duration
    rand(100)
  end
end
