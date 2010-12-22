<div id="repository_{{id}}" class="repository">
  <h3><a href="{{url}}">{{name}}</a></h3>

  {{#last_build}}
    <h4>Current Build</h4>
    <div id="build_{{id}}" class="build">
      {{> builds/_summary}}
    </div>
  {{/last_build}}

  <ul class="tabs clearfix">
    <li>
      <h5>Log</h5>
      {{#last_build}}
        <div id="build_{{id}}" class="build">
          <pre class="log">{{log}}</pre>
        </div>
      {{/last_build}}
    </li>
    <li>
      <h5>Build History</h5>
      <div>
        ...
      </div>
    </li>
  </ul>
</div>
