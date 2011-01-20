<div id="repository_{{id}}" class="repository">
  <h3><a href="{{url}}">{{name}}</a></h3>

  <ul class="tabs">
    <li id="tab_current">
      <h5><a href="#!/{{name}}">Current</a></h5>
      <div>
      </div>
    </li>
    <li id="tab_history">
      <h5><a href="#!/{{name}}/builds">Build History</a></h5>
      <div>
      </div>
    </li>
    <li id="tab_build">
      {{#if build}}
      {{/if}}
    </li>
  </ul>
</div>
