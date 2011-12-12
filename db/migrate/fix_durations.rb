# require File.expand_path('config/environment')

Build.class_eval do
  def self.duration_missing
    where(:duration => nil).includes(:matrix).order('id DESC')
  end

  def self.update_durations(options = {})
    duration_missing.limit(options[:limit] || 50).each do |build|
      build.update_attributes(:duration => build.matrix_duration) rescue nil
    end
  end
end

Repository.class_eval do
  def self.last_build_duration_missing
    where(:last_build_duration => nil).includes(:last_build).order('id DESC')
  end

  def self.update_last_build_durations(options = {})
    last_build_duration_missing.limit(options[:limit] || 50).each do |repository|
      repository.update_attributes(:last_build_duration => repository.last_build.try(:duration)) # rescue nil
    end
  end
end

