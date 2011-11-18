require 'ostruct'
require 'core_ext/ostruct/hash_access'

# TODO: we need to start using octokit everywhere by now. Or stick to that implementation, depending on team reaction.
module Github
  module ServiceHook
    class Payload < OpenStruct
      def initialize(payload)
        payload = ActiveSupport::JSON.decode(payload) if payload.is_a?(String)
        super(payload)
      end

      def repository
        @repository ||= Repository.new(super)
      end

      def commits
        @commits ||= self['commits'].map { |commit| Commit.new(commit.merge('ref' => ref, 'compare_url' => compare_url), repository) }
      end

      def compare_url
        self['compare']
      end
    end
  end

  class Repository < OpenStruct
    ATTR_NAMES = [:name, :url, :owner_name, :owner_email]

    def to_hash
      ATTR_NAMES.inject({}) { |result, name| result.merge(name => self.send(name)) }
    end

    def owner_name
      owner['name']
    end

    def owner_email
      if organization
        organization_emails.join(',')
      else
        user_email
      end
    end

    def private?
      self['private']
    end
    
    private
      def organization_members
        Travis::GithubApi.organization_members(organization)
      end
      
      def organization_emails
        organization_members.map { |user| user['email'] }.select(&:present?)
      end
      
      def user_email
        owner['email'].presence || Travis::GithubApi.user(owner_name)['email']
      end

      def owner
        @owner ||= self['owner'].is_a?(Hash) ? self['owner'] : { 'name' => owner }
      end
  end

  class Commit < OpenStruct
    ATTR_NAMES = [:commit, :message, :branch, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url]

    def initialize(data, repository)
      data['author'] ||= {}
      data['repository']  = repository
      super(data)
    end

    def to_hash
      ATTR_NAMES.inject({}) { |result, name| result.merge(name => self.send(name)) }
    end

    def commit
      self['id']
    end

    def branch
      (self['ref'] || '').split('/').last
    end

    def committed_at
      self['timestamp']
    end

    def committer
      self['committer'] || {}
    end

    def committer_name
      committer['name']
    end

    def committer_email
      committer['email']
    end

    def author
      self['author'] || {}
    end

    def author_name
      author['name']
    end

    def author_email
      author['email']
    end

    def compare_url
      self['compare_url']
    end
  end
end


