class RepositoryStripOwnerNameFromName < ActiveRecord::Migration
  def self.up
    Repository.all.each do |repository|
      repository.update_attributes!(:name => repository.name.split('/')[1])
    end
  end

  def self.down
    Repository.all.each do |repository|
      repository.update_attributes!(:name => [repository.owner_name, repository.name].join('/'))
    end
  end
end
