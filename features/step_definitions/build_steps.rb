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

Given /^the following repositories:$/ do |table|
  table.hashes.each do |attributes|
    Repository.create(attributes)
  end
end

Given /^the following builds:$/ do |table|
  table.hashes.each do |attributes|
    attributes.delete('status') if attributes['status'].blank?
    attributes['repository'] = Repository.where(:name => attributes['repository']).first
    Build.create(attributes)
  end
end

Given /^a repository with the uri "([^"]*)"$/ do |uri|
  Repository.create!(:uri => uri)
end

Given /^the current time is (\d+)\-(\d+)\-(\d+) (\d+):(\d+):(\d+)$/ do |year, month, day, hour, minute, second|
  Time.stubs(:now).returns(Time.utc(year, month, day, hour, minute, second))
end

When /^someone triggers a build for the repository "([^"]*)"$/ do |arg1|
  post '/builds', :payload => GITHUB_PAYLOAD.to_json
end

Then /^I should see the following repositories within the repositories list:$/ do |repositories|
  repositories.hashes.each_with_index do |repository, ix|
    within "#repositories .repository:nth-of-type(#{ix + 1})" do
      assert_select 'a', /#{repository['name']}/
      assert_select '.last_build', "##{repository['build']}"
      assert_select '.duration', "Duration: #{repository['duration']}"
      assert_select '.eta', "ETA: #{repository['eta']}" if repository['eta'].present?
      assert_select '.finished_at', repository['finished_at'] if repository['finished_at'].present?
    end
  end
end

def hashify(string)
  Hash[*string.split(',').map { |value| value.split(':').map(&:strip) }.flatten]
end

Then /^I should see the following repository information within the repository pane:$/ do |repository|
  repository   = repository.rows_hash
  last_success = hashify(repository['last_success'])
  last_failure = hashify(repository['last_failure'])

  assert_select '#repository' do
    assert_select 'h3', repository['name']
    assert_select '#last_success' do
      assert_select '.build',    "##{last_success['build']}"
      assert_select '.duration', "(#{last_success['duration']})"
      assert_select '.finished_at', last_success['finished_at']
    end
  end
end

Then /^I should see the following build history within the repository pane:$/ do |expected|
  expected.cell_matrix.shift
  actual = table(tableish('#build_history tr', 'td'))
  expected.diff!(actual)
end

Then /^I should see the following build information within the build pane:$/ do |build|
  build = build.rows_hash
  assert_select '#build' do
    assert_select 'h3', "Build #{build['build']}"
    assert_select '#summary' do
      assert_select '.commit', "[#{build['commit']}] #{build['message']}"
      assert_select '.finished_at', build['finished_at']
      assert_select '.duration', build['duration']
    end
  end
end

Then /^I should see the build log "([^"]*)"$/ do |log|
  assert_select '#build_log', log
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

