Given /^a repository "([^"]*)"$/ do |name|
  owner_name, name = name.split('/')
  Factory(:repository, :owner_name => owner_name, :name => name)
end

Given /^"([^"]*)" has an? (un)?stable build$/ do |name, status|
  owner_name, name = name.split('/')
  repository = Repository.where(:owner_name => owner_name, :name => name).first
  Factory(
    :build,
    :started_at => Time.now,
    :finished_at => Time.now,
    :repository => repository,
    :status => status ? 1 : 0
  )
end

Given /^"([^"]*)" has an unfinished build$/ do |name|
  owner_name, name = name.split('/')
  repository = Repository.where(:owner_name => owner_name, :name => name).first
  Factory(:build, :started_at => Time.now, :repository => repository)
end

Given /^a repository "([^"]*)" does not exist$/ do |name|
  owner_name, name = name.split('/')
  Repository.delete_all(:owner_name => owner_name, :name => name)
end
