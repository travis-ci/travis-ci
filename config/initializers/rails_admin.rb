RailsAdmin.authorize_with do
  redirect_to root_path unless warden.user.is_admin?
end