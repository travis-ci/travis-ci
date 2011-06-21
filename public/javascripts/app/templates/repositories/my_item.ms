<li class="repository">
  <a href="{{url}}" rel="nofollow">{{name}}</a>
  <p class='description'>{{description}}</p>
  <div class="controls">
    <a href="{{url}}/admin/hooks#travis" class="github-admin tool-tip" title="Github service hooks admin page">admin</a>
    {{#if is_active}}
      <a class='toggle_enabled on'></a>
    {{else}}
      <a class='toggle_enabled'></a>
    {{/if}}
  </div>
</li>

