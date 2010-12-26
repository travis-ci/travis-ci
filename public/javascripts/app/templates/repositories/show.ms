<div id="repository_{{id}}" class="repository">
  <h3><a href="{{url}}">{{name}}</a></h3>

  {{#build}}
    <h4>Current Build</h4>
    <div id="build_{{id}}" class="build">
      {{> builds/_summary}}
    </div>
  {{/build}}

  <ul class="tabs">
    <li>
      <h5>Log</h5>
      {{#build}}
        <div id="build_{{id}}" class="build">
          <pre class="log">{{log}}</pre>
        </div>
      {{/build}}
    </li>
    <li>
      <h5>Build History</h5>
      <div>
        ...
      </div>
    </li>
  </ul>
</div>
