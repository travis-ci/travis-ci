<dl class="summary left clearfix {{color}}">
  <div class="left">
    <dt>Build</dt>
    <dd class="number"><a href="/#!/{{repository/slug}}/builds/{{id}}">{{number}}</a></dd>
    <dt class="finished_at_label">Finished</dt>
    <dd class="finished_at timeago" title="{{finished_at}}">-</dd>
    <dt>Duration</dt>
    <dd class="duration" title="{{duration}}">-</dd>
  </div>

  <div class="right">
    <dt>Commit</dt>
    <dd class="commit-hash"><a href="http://github.com/{{repository/slug}}/commit/{{commit}}">{{commit}}{{#if branch}} ({{branch}}){{/if}}</a></dd>
    <dt>Author</dt>
    <dd class="author"><a href="mailto://{{author_email}}">{{author_name}}</a></dd>
    {{#if committer_name}}
      <dt>Committer</dt>
      <dd class="committer"><a href="mailto://{{committer_email}}">{{committer_name}}</a></dd>
    {{/if}}
  </div>

  <dt>Message</dt>
  <dd class="commit-message">{{message}}</dd>
  {{#if parent_id}}
    <dt>Config</dt>
    <dd class="config">{{config}}</dd>
  {{/if}}
</dl>
