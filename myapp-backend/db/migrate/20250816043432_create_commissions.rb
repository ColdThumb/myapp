class CreateCommissions < ActiveRecord::Migration[8.0]
  def change
    create_table :commissions do |t|
      t.string :title, null: false
      t.text :description
      t.decimal :budget, precision: 10, scale: 2
      t.integer :status, null: false, default: 0
      t.references :customer, null: false, foreign_key: { to_table: :users }
      t.references :assigned_author, null: true, foreign_key: { to_table: :users }
      t.date :estimated_delivery_date

      t.timestamps
    end

    add_index :commissions, :status
  end
end
