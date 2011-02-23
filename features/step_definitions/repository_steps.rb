Given /^a repository named "([^"]*)"$/ do |name|
  Factory(:repository, :name => name)
end

Given /^"([^"]*)" has an? (un)?stable build$/ do |name, status|
  repository = Repository.where(:name => name).first
  Factory(
    :build,
    :started_at => Time.now,
    :finished_at => Time.now,
    :repository => repository,
    :status => status ? 1 : 0
  )
end

Given /^"([^"]*)" has an unfinished build$/ do |name|
  repository = Repository.where(:name => name).first
  Factory(:build, :started_at => Time.now, :repository => repository)
end

Given /^a repository named "([^"]*)" does not exist$/ do |name|
  Repository.delete_all(:name => name)
end
