class Commit < ActiveRecord::Base
  belongs_to :repository
  validates :commit, :branch, :message, :committed_at, :presence => true
  
  def mail_to_hex_author_email
    generate_mail_to_hex author_email
  end
  
  def mail_to_hex_committer_email
    generate_mail_to_hex committer_email
  end
  
  private
  
  def generate_mail_to_hex(email)
    'mailto:'.unpack('C*').map { |c|
      sprintf("&#%d;", c)
    }.join + email.unpack('C*').map { |c|
      char = c.chr
      char =~ /\w/ ? sprintf("%%%x", c) : char
    }.join
  end
end
