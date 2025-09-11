# rails g migration AddVisibilityToArticles
class AddVisibilityToArticles < ActiveRecord::Migration[8.0]
  def up
    add_column :articles, :visibility, :string, null: false, default: "public"
    add_index  :articles, :visibility

    # 兼容旧数据：is_public=true -> public；false -> private
    execute <<~SQL.squish
      UPDATE articles SET visibility = 'public'  WHERE is_public = TRUE;
      UPDATE articles SET visibility = 'private' WHERE is_public = FALSE;
    SQL

    remove_index  :articles, :is_public if index_exists?(:articles, :is_public)
    remove_column :articles, :is_public
  end

  def down
    add_column :articles, :is_public, :boolean, null: false, default: true
    add_index  :articles, :is_public

    execute <<~SQL.squish
      UPDATE articles SET is_public = TRUE  WHERE visibility = 'public';
      UPDATE articles SET is_public = FALSE WHERE visibility = 'private';
    SQL

    remove_index  :articles, :visibility if index_exists?(:articles, :visibility)
    remove_column :articles, :visibility
  end
end
