class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string  :name,  null: false
      t.string  :email, null: false
      t.boolean :is_author, null: false, default: false
      t.boolean :is_client, null: false, default: true
      t.text    :bio

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
