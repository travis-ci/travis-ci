class JobsAddRetries < ActiveRecord::Migration
  def change
    change_table :jobs do |t|
      t.integer :retries, :default => 0
    end
  end
end
