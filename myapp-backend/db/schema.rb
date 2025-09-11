# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_30_064927) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "pg_catalog.plpgsql"

  create_table "announcements", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.string "title", null: false
    t.text "body", null: false
    t.boolean "is_pinned", default: false, null: false
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id", "is_pinned"], name: "index_announcements_on_author_id_and_is_pinned"
    t.index ["author_id"], name: "index_announcements_on_author_id"
    t.index ["published_at"], name: "index_announcements_on_published_at"
  end

  create_table "article_challenges", force: :cascade do |t|
    t.bigint "article_id", null: false
    t.text "prompt", null: false
    t.text "answer_hash", null: false
    t.string "normalize_rule", default: "trim", null: false
    t.text "hint"
    t.boolean "enabled", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id", "enabled"], name: "index_article_challenges_on_article_id_and_enabled"
    t.index ["article_id"], name: "index_article_challenges_on_article_id"
  end

  create_table "articles", force: :cascade do |t|
    t.string "title", null: false
    t.text "body"
    t.bigint "author_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "visibility", default: "public", null: false
    t.index ["author_id"], name: "index_articles_on_author_id"
    t.index ["visibility"], name: "index_articles_on_visibility"
  end

  create_table "commissions", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.decimal "budget", precision: 10, scale: 2
    t.integer "status", default: 0, null: false
    t.bigint "customer_id", null: false
    t.bigint "assigned_author_id"
    t.date "estimated_delivery_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "progress_pct", default: 0, null: false
    t.index ["assigned_author_id"], name: "index_commissions_on_assigned_author_id"
    t.index ["customer_id"], name: "index_commissions_on_customer_id"
    t.index ["progress_pct"], name: "index_commissions_on_progress_pct"
    t.index ["status"], name: "index_commissions_on_status"
    t.check_constraint "progress_pct >= 0 AND progress_pct <= 100", name: "comm_progress_pct_0_100"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.citext "email", null: false
    t.boolean "is_author", default: false, null: false
    t.boolean "is_client", default: true, null: false
    t.text "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "announcements", "users", column: "author_id"
  add_foreign_key "article_challenges", "articles"
  add_foreign_key "articles", "users", column: "author_id"
  add_foreign_key "commissions", "users", column: "assigned_author_id"
  add_foreign_key "commissions", "users", column: "customer_id"
end
