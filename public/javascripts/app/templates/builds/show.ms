<div id="build_{{id}}" class="build">
  <h3><a href="{{repository/url}}">{{repository/name}}</a></h3>

  <h4>Build #{{number}}</h4>
  <p><a href="{{url}}">{{url}}</a></p>
  {{> builds_summary}}

  <ul class="tabs clearfix">
    <li id="tab_log" class="tab">
      <h5>Log</h5>
      <div>
        <pre class="log">{{log}}</pre>
      </div>
    </li>
  </ul>
</div>

