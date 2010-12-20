<div id="build_{{id}}" class="build">
  <h3><a href="{{repository/url}}">{{repository/name}}</a></h3>

  <h4>Build #{{number}}</h4>
  <p><a href="{{url}}">{{url}}</a></p>
  {{> builds/_summary}}

  <ul class="tabs">
    <li>
      <h5>Log</h5>
      <div>
        <pre class="log">{{log}}</pre>
      </div>
    </li>
  </ul>
</div>

