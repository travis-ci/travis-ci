require 'net/http'
require 'uri'
require 'json'

class RepositoriesAddOwnerNameAndOwnerEmail < ActiveRecord::Migration
  def self.up
    change_table :repositories do |t|
      t.string :owner_name
      t.string :owner_email
    end

    Repository.all.each do |r|
      r.update_attributes!(
        :owner_name  => r.username,
        :owner_email => fetch_owner_email(r.name)
      )
    end

    remove_column :repositories, :username
  end

  def self.down
    change_table :repositories do |t|
      t.string :username
    end

    Repository.all.each do |r|
      r.update_attributes!(:username => r.owner_name)
    end

    remove_column :repositories, :owner_name
    remove_column :repositories, :owner_email
  end

  def self.fetch_owner_email(name)
    repository = fetch("repos/show/#{name}")['repository'] || {}
    if name = repository['organization']
      fetch_organization_member_emails(name)
    else
      fetch_user_email(repository['owner'])
    end
  end

  def self.fetch_organization_member_emails(name)
    organization = fetch("organizations/#{name}/public_members")
    emails = organization['users'].map { |member| member['email'] }
    emails.select(&:present?).join(',')
  end

  def self.fetch_user_email(name)
    user = fetch("user/show/#{name}")
    user['user']['email']
  end

  def self.fetch(path)
    uri = URI.parse("http://github.com/api/v2/json/#{path}")
    puts "puts fetching #{uri}"
    response = Net::HTTP.get_response(uri)
    JSON.parse(response.body)
  rescue
    {}
  end
end
