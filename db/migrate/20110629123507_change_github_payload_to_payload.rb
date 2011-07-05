class ChangeGithubPayloadToPayload < ActiveRecord::Migration
  def self.up
    rename_column :builds, :github_payload, :payload
  end

  def self.down
    rename_column :builds, :payload, :github_payload
  end
end
