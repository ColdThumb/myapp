# rails g migration CreateAnnouncements
class CreateAnnouncements < ActiveRecord::Migration[8.0]
  def change
    create_table :announcements do |t|
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.string  :title,       null: false
      t.text    :body,        null: false
      t.boolean :is_pinned,   null: false, default: false
      t.datetime :published_at

      t.timestamps
    end

    add_index :announcements, :published_at
    add_index :announcements, [ :author_id, :is_pinned ]
  end
end
