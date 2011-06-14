<li class="repository">
  <a href="{{url}}" target="_blank" rel="nofollow">{{name}}</a>
  <p class='description'>{{description}}</p>
  <ul class="github-stats">
    <li><a href="{{url}}/forks" target="_blank" rel="nofollow" class='forks'>{{forks}}</a></li>
    <li><a href="{{url}}/forks" target="_blank" rel="nofollow" class='watchers'>{{forks}}</a></li>
  </ul>
  {{#unless travis_enabled}}
    <div class='enable_travis'>Add to Travis-CI!</div>
  {{/unless}}
</li>
