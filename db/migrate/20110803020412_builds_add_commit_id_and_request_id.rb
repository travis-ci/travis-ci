class BuildsAddCommitIdAndRequestId < ActiveRecord::Migration
  def self.up
    change_table :builds do |t|
      t.references :commit
      t.references :request
    end
  end

  def self.down
    change_table :builds do |t|
      t.remove :commit_id
      # t.remove :request_id
    end
  end
end
