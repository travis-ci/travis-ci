# encoding: UTF-8
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

ActiveRecord::Schema.define(:version => 20110911204538) do

  create_table "builds", :force => true do |t|
    t.integer  "repository_id"
    t.string   "number"
    t.integer  "status"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.string   "commit"
    t.string   "agent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "config"
    t.integer  "commit_id"
    t.integer  "request_id"
    t.string   "state"
  end

  add_index "builds", ["repository_id"], :name => "index_builds_on_repository_id"

  create_table "commits", :force => true do |t|
    t.integer  "repository_id"
    t.string   "commit"
    t.string   "ref"
    t.string   "branch"
    t.text     "message"
    t.string   "compare_url"
    t.datetime "committed_at"
    t.string   "committer_name"
    t.string   "committer_email"
    t.string   "author_name"
    t.string   "author_email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rails_admin_histories", :force => true do |t|
    t.string   "message"
    t.string   "username"
    t.integer  "item"
    t.string   "table"
    t.integer  "month"
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
    t.boolean  "active"
  end

  add_index "repositories", ["last_build_started_at"], :name => "index_repositories_on_last_build_started_at"
  add_index "repositories", ["owner_name", "name"], :name => "index_repositories_on_owner_name_and_name"

  create_table "requests", :force => true do |t|
    t.integer  "repository_id"
    t.integer  "commit_id"
    t.string   "state"
    t.string   "source"
    t.text     "payload"
    t.string   "token"
    t.text     "config"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", :force => true do |t|
    t.integer  "repository_id"
    t.integer  "commit_id"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "type"
    t.string   "state"
    t.string   "number"
    t.text     "config"
    t.integer  "status"
    t.text     "log",           :default => ""
    t.string   "job_id"
    t.string   "worker"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "queue"
    t.text     "tags"
  end

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
