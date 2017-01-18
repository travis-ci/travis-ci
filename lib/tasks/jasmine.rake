namespace :jasmine do
  namespace :fixtures do
    task :update => :environment do
      raise "RAILS_ENV must be jasmine" unless Rails.env.jasmine?

      target = Rails.root.join('public/javascripts/tests/fixtures/models')
      %w(repositories.json builds repositories).each do |path|
        target.join(path).rmtree rescue nil
      end

      file = target.join("repositories.json")
      file.open('w+') { |f| f.write(Repository.timeline.as_json.to_json) }

      Repository.all.each do |repository|
        file = target.join("repositories/#{repository.id}/builds.json")
        file.dirname.mkpath
        file.open('w+') { |f| f.write(repository.builds.started.order('id DESC').limit(10).as_json.to_json) }
      end

      Build.all.each do |build|
        file = target.join("builds/#{build.id}.json")
        file.dirname.mkpath
        file.open('w+') { |f| f.write(build.as_json.to_json) }
      end
    end
  end
end

