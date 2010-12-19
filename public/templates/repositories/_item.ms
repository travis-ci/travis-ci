<li id="repository_{{id}}" class="repository {{last_build/color}}">
  <a href="/#!/repositories/{{id}}">{{name}}</a>
  {{#last_build}}
    <a href="/#!/builds/{{id}}" class="last_build">#{{number}}</a>
    <p class="summary">
      <span class="duration">Duration: {{duration}},</span>
      {{#finished_at}}
        Finished: <abbr class="finished_at" data-finished_at="{{../finished_at}}">{{../finished_at_in_words}}</abbr>
      {{/finished_at}}
      {{#eta}}
        ETA: <abbr class="eta" data-finished_at="{{../eta}}">{{../eta_in_words}}</abbr>
      {{/eta}}
    </p>
  {{/last_build}}
</li>
