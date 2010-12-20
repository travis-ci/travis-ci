<div id="repository_{{id}}" class="repository">
  <h3><a href="{{url}}">{{name}}</a></h3>

  {{#last_build}}
    <h4>Current Build</h4>
    {{> builds/_summary}}
  {{/last_build}}

  <ul class="tabs">
    <li>
      <h5>Log</h5>
      <div>
        {{#last_build}}
          <pre class="log">{{log}}</pre>
        {{/last_build}}
      </div>
    </li>
    <li>
      <h5>Build History</h5>
      <div>
        ...
      </div>
    </li>
  </ul>
</div>
