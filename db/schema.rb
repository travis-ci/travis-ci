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

ActiveRecord::Schema.define(:version => 20110301071656) do

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
    t.string   "job_id"
    t.string   "agent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "configuration"
    t.integer  "parent_id"
    t.text     "config"
  end

  add_index "builds", ["parent_id"], :name => "index_builds_on_parent_id"
  add_index "builds", ["repository_id"], :name => "index_builds_on_repository_id"

  create_table "repositories", :force => true do |t|
    t.string   "name"
    t.string   "url"
    t.integer  "last_duration"
    t.datetime "last_built_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "username"
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
    t.integer  "oauth2_uid",   :limit => 8
    t.string   "oauth2_token", :limit => 149
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["login"], :name => "index_users_on_login", :unique => true
  add_index "users", ["oauth2_uid"], :name => "index_users_on_oauth2_uid", :unique => true

end
