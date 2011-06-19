# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110619100906) do

  create_table "builds", :force => true do |t|
    t.integer  "repository_id"
    t.string   "number"
    t.integer  "status"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.text     "log",             :default => ""
    t.string   "commit"
    t.text     "message"
    t.datetime "committed_at"
    t.string   "committer_name"
    t.string   "committer_email"
    t.string   "author_name"
    t.string   "author_email"
    t.string   "agent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "parent_id"
    t.text     "config"
    t.string   "ref"
    t.string   "branch"
    t.text     "github_payload"
    t.string   "compare_url"
  end

  add_index "builds", ["parent_id"], :name => "index_builds_on_parent_id"
  add_index "builds", ["repository_id", "parent_id", "started_at"], :name => "index_builds_on_repository_id_and_parent_id_and_started_at"
  add_index "builds", ["repository_id"], :name => "index_builds_on_repository_id"

  create_table "rails_admin_histories", :force => true do |t|
    t.string   "message"
    t.string   "username"
    t.integer  "item"
    t.string   "table"
    t.integer  "month",      :limit => 2
    t.integer  "year",       :limit => 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rails_admin_histories", ["item", "table", "month", "year"], :name => "index_histories_on_item_and_table_and_month_and_year"

  create_table "repositories", :force => true do |t|
    t.string   "name"
    t.string   "url"
    t.integer  "last_duration"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "last_build_id"
    t.string   "last_build_number"
    t.integer  "last_build_status"
    t.datetime "last_build_started_at"
    t.datetime "last_build_finished_at"
    t.string   "owner_name"
    t.text     "owner_email"
    t.boolean  "is_active"
  end

  add_index "repositories", ["last_build_started_at"], :name => "index_repositories_on_last_build_started_at"
  add_index "repositories", ["owner_name", "name"], :name => "index_repositories_on_owner_name_and_name"

  create_table "tokens", :force => true do |t|
    t.integer  "user_id"
    t.string   "token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "login"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_admin",           :default => false
    t.integer  "github_id"
    t.string   "github_oauth_token"
  end

  add_index "users", ["github_id"], :name => "index_users_on_github_id"
  add_index "users", ["github_oauth_token"], :name => "index_users_on_github_oauth_token"
  add_index "users", ["login"], :name => "index_users_on_login", :unique => true

end
