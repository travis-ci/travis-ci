GITHUB_PAYLOAD = {
  'ref' => 'refs/heads/master',
  'before' => '674b59a226bf6f1c8210',
  'after' => '5911413de86b53e29854',
  'repository' => {
    'uri' => 'http://github.com/svenfuchs/i18n',
    'owner' => {
      'email' => 'svenfuchs@artweb-design.de',
      'name' => 'svenfuchs'
    }
  },
  'commits' => [
    {
      'id' => '5911413de86b53e29854',
      'uri' => 'http://github.com/svenfuchs/i18n/commit/5911413de86b53e29854',
      'author' => {
        'email' => 'svenfuchs@artweb-design.de',
        'name' => 'svenfuchs'
      },
      'message' => 'bump to 0.5.0beta3',
      'timestamp' => '2010-11-18T14:57:17+02:00',
      'added' => ['lib/i18n/version.rb']
    }
  ],
}

Given /^a repository with the url "([^"]*)"$/ do |url|
  Repository.create!(:url => url)
end

When /^someone triggers a build for the repository "([^"]*)"$/ do |arg1|
  post '/builds', :payload => GITHUB_PAYLOAD.to_json
end

Then /^a repository should have been created for "([^"]*)"$/ do |name|
  assert @repository = Repository.find_by_name(name)
end

Then /^that repository should have (\d+) builds?$/ do |count|
  assert_equal count.to_i, @repository.builds.count
end

Then /^all users should have received the following update:$/ do |expected|
  update = JSON.parse(Socky.sent.last)
  expected.hashes.each do |hash|
    assert_equal hash['value'], JsonPath.new("$.#{hash['path']}").on(update).first
  end
end

