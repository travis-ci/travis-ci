class Artifact::Log < Artifact
  def append(chars)
    self.class.update_all(["content = COALESCE(content, '') || ?", chars], ["id = ?", id])
  end
end
