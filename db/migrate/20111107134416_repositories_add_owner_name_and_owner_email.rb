require 'net/http'
require 'uri'
require 'json'

class RepositoriesAddOwnerNameAndOwnerEmail < ActiveRecord::Migration
  def self.up
    change_table :repositories do |t|
      t.string :owner_name
      t.string :owner_email
    end rescue nil

    Repository.all.each do |r|
      r.update_attributes!(
        :owner_name  => r.owner_name  || r.url.split('/')[-2],
        :owner_email => r.owner_email || fetch_owner_email(r.url.split('/')[-2, 2].join('/'))
      )
    end

    remove_column :repositories, :username rescue nil
  end

  def self.down
    change_table :repositories do |t|
      t.string :username
    end rescue nil

    Repository.all.each do |r|
      r.update_attributes!(:username => r.url.split('/')[-2]) unless r.owner_name.nil?
    end

    remove_column :repositories, :owner_name  rescue nil
    remove_column :repositories, :owner_email rescue nil
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
  rescue
    nil
  end

  def self.fetch_user_email(name)
    user = fetch("user/show/#{name}")
    user['user']['email']
  rescue
    nil
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
