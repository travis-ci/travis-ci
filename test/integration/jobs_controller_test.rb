require 'test_helper'

class JobsControllerTest < ActionDispatch::IntegrationTest
  def setup
    super
    jobs = [
      { "args" => ["45e545857c0f755b419d0f0d48fd7ac1bede6be9", { "repository" => { "slug" => "svenfuchs/gem-release", "id" => 8 }, "build" => { "number" => "3",   "commit" => "b0a1b69", "config" => { "script" => "ruby test/all.rb", "rvm" => "ree"   }, "id" => 1 } }], "class" => "Travis::Builder" },
      { "args" => ["41fff65cf5898ce8d5d622898140d31e7cdc709a", { "repository" => { "slug" => "svenfuchs/gem-release", "id" => 8 }, "build" => { "number" => "3.1", "commit" => "b0a1b69", "config" => { "script" => "ruby test/all.rb", "rvm" => "jruby" }, "id" => 2 } }], "class" => "Travis::Builder" }
    ]
    Resque.stubs(:peek).returns(jobs)
  end

  test '.index list all jobs on the queue' do
    get('jobs', :format => :json)

    jobs = ActiveSupport::JSON.decode(response.body)

    expected = [
      { 'id' => 1, 'number' => '3',   'commit' => 'b0a1b69','repository' => { 'id' => 8, 'slug' => 'svenfuchs/gem-release' } },
      { 'id' => 2, 'number' => '3.1', 'commit' => 'b0a1b69','repository' => { 'id' => 8, 'slug' => 'svenfuchs/gem-release' } },
    ]

    assert_equal expected, jobs
  end
end
