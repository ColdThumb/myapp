# rails g migration CreateArticleChallenges
class CreateArticleChallenges < ActiveRecord::Migration[8.0]
  def change
    create_table :article_challenges do |t|
      t.references :article, null: false, foreign_key: true
      t.text    :prompt,       null: false
      t.text    :answer_hash,  null: false  # bcrypt/argon2 的结果
      t.string  :normalize_rule, null: false, default: "trim" # 'none'/'trim'/'ci'/'ci_trim'
      t.text    :hint
      t.boolean :enabled,      null: false, default: true

      t.timestamps
    end

    add_index :article_challenges, [ :article_id, :enabled ]
  end
end
