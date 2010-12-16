<div id="build">
  <h3>#{{number}}</h3>
  <p><a href="{{url}}">{{url}}</a></p>

  {{#build}}
    <h4>
      Last Build
      <a href="#!/builds/{{id}}">#{{number}}</a>
    </h4>
    <dl class="summary">
      {{#commit}}
        <dt>Commit<dt>
        <dd class="commit-hash">{{hash}}</dd>
        <dt>Message<dt>
        <dd class="commit-message">{{message}}</dd>
        <dt>Committed<dt>
        <dd class="commit-committed">
          {{date_in_words}} by
          {{#author}}
            <a href="mailto:{{email}}">{{name}}</a>
          {{/author}}
        </dd>
      {{/commit}}
      <dt>Duration<dt>
      <dd class="duration">{{duration_in_words}}</dd>
      {{#finished_at}}
        <dt>Finished</dt>
        <dd class="finished_at" data-finished_at="{{../finished_at}}">{{../finished_at_in_words}}</d>
      {{/finished_at}}
      {{#eta}}
        <dt>ETA</dt>
        <dd class="eta" data-finished_at="{{../eta}}">{{../eta_in_words}}</d>
      {{/eta}}
    </dl>
  {{/build}}

  <h4>Build History</h4>

</div>

