class CreateWorkers < ActiveRecord::Migration
  def change
    create_table :workers do |t|
      t.string :name
      t.string :host
      t.string :state
      t.datetime :last_seen_at
    end

    add_index :workers, [:name, :host]
  end
end
