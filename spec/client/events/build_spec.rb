require 'client/spec_helper'

feature 'Walking through the build process', :js => true do
  before :each do
    Travis.config.notifications = [:worker]
  end

  let(:github_payloads) { GITHUB_PAYLOADS }
  let(:queue_payloads)  { QUEUE_PAYLOADS  }
  let(:worker_payloads) { WORKER_PAYLOADS }

  scenario 'reloading the page after each event' do
    ping_from_github! :reload_page => true
    should_see_job 'svenfuchs/gem-release' # TODO should see 'svenfuchs/gem-release *'
    queue_payloads['task:configure'].should be_queued(:queue => 'builds', :pop => true)

    receive_from_worker!('task:configure:started', :reload_page => true)
    should_not_see_job 'svenfuchs/gem-release'

    receive_from_worker!('task:configure:finished', :reload_page => true)
    should_see_jobs 'svenfuchs/gem-release #1.1', 'svenfuchs/gem-release #1.2'
    should_have_jobs 'task:test:1', 'task:test:2'

    2.upto(3) do |id|
      number = "1.#{id - 1}"

      receive_from_worker!('task:test:started', :to => "builds/#{id}", :reload_page => true)
      should_not_see_job "svenfuchs/gem-release #{number}"
      should_see_selected_repository 'svenfuchs/gem-release', :color => 'yellow'
      should_see_matrix '1.1', '1.2', :tab => 'current'

      1.upto(3) do |num|
        receive_from_worker!("task:test:log:#{num}", :to => "builds/#{id}/log", :reload_page => true)
      end
      click_link number
      should_see_log 'the full log'

      receive_from_worker!('task:test:finished', :to => "builds/#{id}", :reload_page => true)
      click_link number
    end

    should_see_selected_repository 'svenfuchs/gem-release', :duration => '1 min', :finished_at => 'ago', :color => 'green'
  end

  def ping_from_github!(options = { :reload_page => false })
    post 'builds', :payload => github_payloads['gem-release']
    visit '/' if options[:reload_page]
  end

  def receive_from_worker!(event, options = { :reload_path => false })
    put options[:to] || 'builds/1', worker_payloads[event] # legacy route. should be tasks/1 in future
    visit '/' if options[:reload_page]
  end

  def should_see_job(*jobs)
    jobs.each do |job|
      should_see job, :within => '#jobs.queue-builds'
    end
  end
  alias :should_see_jobs :should_see_job

  def should_not_see_job(*jobs)
    jobs.each do |job|
      should_not_see job, :within => '#jobs.queue-builds'
    end
  end
  alias :should_not_see_jobs :should_not_see_job

  def should_have_job(*jobs)
    jobs.each do |job|
      queue_payloads[job].should be_queued(:queue => 'builds', :pop => true)
    end
  end
  alias :should_have_jobs :should_have_job

  def should_see_log(log)
    should_see log, :within => '#tab_build.active .log'
  end

  def should_see_selected_repository(*args)
    attrs = args.extract_options!
    color = attrs.delete(:color)
    attrs.merge!(:text => args.pop) unless args.empty?

    attrs.each do |name, value|
      selector =  '#repositories .repository.selected'
      selector << ".#{color}" unless color == 'yellow'
      selector << " .#{name}" unless name == :text
      should_see value, :within => selector
    end
  end

  def should_see_matrix(*args)
    options = args.extract_options!
    args.each do |number|
      should_see number, :within => "#tab_#{options[:tab]}.active"
    end
  end
end
