class CreateWorkers < ActiveRecord::Migration
  def change
    create_table :workers do |t|
      t.string :name
      t.string :hostname
      t.string :state
      t.datetime :last_seen_at
    end

    add_index :workers, [:name, :hostname]
  end
end
