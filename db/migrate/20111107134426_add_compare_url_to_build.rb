class AddCompareUrlToBuild < ActiveRecord::Migration
  def self.up
    add_column :builds, :compare_url, :string
  end

  def self.down
    remove_column :builds, :compare_url
  end
end
