class WorkersAddPayloadAndLastError < ActiveRecord::Migration
  def change
    change_table :workers do |t|
      t.text :payload
      t.text :last_error
    end
  end
end

