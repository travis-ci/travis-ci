module TabsHelper
  protected
  def tabs
    @tabs ||= %w(repos profile).select { |tab| display_tab?(tab) }
  end

  def current_tab
    params[:tab]
  end

  def display_tab?(tab)
    tab != 'profile' || owner == current_user
  end

  def owner
    @owner ||= params[:owner_name] ? owners.detect { |owner| owner.login == params[:owner_name] } : current_user
  end

  def owners
    @owners ||= [current_user] + Organization.where(:login => owner_names)
  end

  def repository_counts
    @repository_counts ||= Repository.counts_by_owner_names(owner_names)
  end
end
