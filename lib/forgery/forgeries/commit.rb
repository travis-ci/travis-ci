class Forgery::Commit < Forgery
  def self.commit
    dictionaries[:commits].random
  end
  def self.branch
    dictionaries[:commit_branches].random
  end
  def self.message
    dictionaries[:commit_messages].random
  end
  def self.commiter_name
    dictionaries[:commiter_names].random
  end
  def self.commiter_email
    dictionaries[:commiter_emails].random
  end
  def self.compare_url
    dictionaries[:commit_compare_urls].random
  end
end
