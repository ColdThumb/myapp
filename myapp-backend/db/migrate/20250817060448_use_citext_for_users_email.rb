class UseCitextForUsersEmail < ActiveRecord::Migration[8.0]
  def up
    enable_extension "citext" unless extension_enabled?("citext")
    change_column :users, :email, :citext, null: false
  end

  def down
    change_column :users, :email, :string, null: false
  end
end
