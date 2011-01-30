class Profiles::Show < Minimal::Template
  def to_html
    h2 current_user.name
    profile
    tokens
  end

  def profile
    ul :id => :profile do
      li { link_to("#{current_user.login} on Github", "http://github.com/#{current_user.login}") }
      li current_user.email
    end
  end

  def tokens
    h4 'Your tokens'
    ul :id => :tokens do
      current_user.tokens.each do |token|
        li do
          self << token.token
          link_to 'remove', '#'
        end
      end
    end
    p { link_to 'create', '#' }
  end
end
