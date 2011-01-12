<div id="repository_{{id}}" class="repository">
  <h3><a href="{{url}}">{{name}}</a></h3>

  {{#build}}
    <h4>Current Build</h4>
    <div id="build_{{id}}" class="build">
      {{> builds_summary}}
    </div>
  {{/build}}

  <ul class="tabs">
    <li id="tab_log">
      <h5><a href="#!/{{name}}">Log</a></h5>
      {{#build}}
        <div id="build_{{id}}" class="build">
          <pre class="log">{{log}}</pre>
        </div>
      {{/build}}
    </li>
    <li id="tab_history">
      <h5><a href="#!/{{name}}/builds">Build History</a></h5>
      <div>
      </div>
    </li>
  </ul>
</div>
