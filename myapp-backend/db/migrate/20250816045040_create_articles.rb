class CreateArticles < ActiveRecord::Migration[8.0]
  def change
    create_table :articles do |t|
      t.string  :title, null: false
      t.text    :body
      t.boolean :is_public, null: false, default: true
      t.references :author, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :articles, :is_public
  end
end
