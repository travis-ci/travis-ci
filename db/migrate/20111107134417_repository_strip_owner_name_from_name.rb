class RepositoryStripOwnerNameFromName < ActiveRecord::Migration
  def self.up
    Repository.all.each do |repository|
      repository.update_attributes!(:name => repository.url.split('/')[-1])
    end
  end

  def self.down
    Repository.all.each do |repository|
      unless repository.name.include?('/')
        repository.update_attributes!(:name => repository.url.split('/')[-2, 2].join('/'))
      end
    end
  end
end
