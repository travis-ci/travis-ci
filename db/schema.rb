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

ActiveRecord::Schema.define(:version => 20101126174715) do

  create_table "builds", :force => true do |t|
    t.integer  "repository_id"
    t.integer  "number"
    t.integer  "status"
    t.string   "commit"
    t.text     "message"
    t.integer  "duration"
    t.text     "log"
    t.string   "agent"
    t.datetime "finished_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "repositories", :force => true do |t|
    t.string   "name"
    t.string   "uri"
    t.integer  "last_duration"
    t.datetime "last_built_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
