require 'rubygems'
require 'bundler/setup'
require 'travis'
require 'gh'
require 'logger'

Travis::Database.connect
ActiveRecord::Base.logger = Logger.new('tmp/populate-owner.db.log')

def populate_owners
  Repository.where(owner_id: nil).each do |repo|
    puts "\ntrying to populate: #{repo.slug}"
    populate_owner(repo)
  end
  nil
end

def populate_owner(repo)
  if owner = find_local_owner(repo.owner_name) || create_owner(repo)
    # ugh. it seems we have some duplicate repos in the staging db
    Repository.where(owner_name: repo.owner_name, name: repo.name).update_all(owner_id: owner.id, owner_type: owner.class.name)
    puts "populated: #{repo.slug}"
  else
    puts "COULD NOT POPULATE OWNER for: #{repo.slug}"
  end
rescue => e
  puts e.message
  puts e.backtrace
end

def create_owner(repo)
  create_user(repo.owner_name) || create_org(repo.owner_name)
  # if data = fetch("https://api.github.com/repos/#{repo.slug}")
  #   send(:"create_#{data['organization'] ? 'org' : 'user'}", repo.owner_name)
  # else
  #   create_user(repo.owner_name) || create_org(repo.owner_name)
  # end
rescue => e
  puts e.message
  puts e.backtrace
end

def create_user(name)
  if data = fetch("https://api.github.com/users/#{name}")
    User.create!(login: data['login'], github_id: data['id'], name: data['name'], email: data[:email], gravatar_id: data['gravatar_id'])
  else
    puts "could not fetch user: #{name}"
  end
end

def create_org(name)
  if data = fetch("https://api.github.com/orgs/#{name}")
    Organization.create!(login: data['login'], github_id: data['id'])
  else
    puts "could not fetch org: #{name}"
  end
end

def find_local_owner(login)
  User.find_by_login(login) || Organization.find_by_login(login)
end

def fetch(url)
  response = Faraday.get(url)
  JSON.parse(response.body) if response.status == 200
end
