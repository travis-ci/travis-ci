<div id="build_{{id}}" class="build">
  <h3>Build #{{number}}</h3>
  <p><a href="{{url}}">{{url}}</a></p>

  <dl class="summary clearfix">
    <dt>Commit</dt>
    <dd class="commit-hash">{{commit}}</dd>
    <dt>Message</dt>
    <dd class="commit-message">{{message}}</dd>
    <dt>Duration</dt>
    <dd class="duration">{{duration}}</dd>
    {{#finished_at}}
      <dt>Finished</dt>
      <dd class="finished_at" data-finished_at="{{../finished_at}}">{{../finished_at}}</d>
    {{/finished_at}}
    {{#eta}}
      <dt>ETA</dt>
      <dd class="eta" data-finished_at="{{../eta}}">{{../eta_in_words}}</d>
    {{/eta}}
  </dl>

  <h4>Log</h4>
  <pre class="log">{{log}}</pre>

</div>

