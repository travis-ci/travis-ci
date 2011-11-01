class Artifact::Log < Artifact
  def append(chars)
    self.class.update_all(["message = COALESCE(message, '') || ?", chars], ["id = ?", id])
  end
end
