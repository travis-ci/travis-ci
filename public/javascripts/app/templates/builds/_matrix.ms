<h4>Build Matrix</h4>

<table id="matrix">
  <thead>
    <tr>
      <th>Build</th>
      {{#each dimensions}}
        <th>{{this}}</th>
      {{/each}}
      <th>Finished</th>
      <th>Duration</th>
    </tr>
  </thead>
  {{#each builds}}
    <tbody>
      <tr class="build {{color}}">
        <td><a href="{{repository/name}}/builds/{{id}}">{{number}}</a></td>
        {{#each config}}
          <td>{{value}}</td>
        {{/each}}
        <td>{{finished_at}}</td>
        <td>{{duration}}</td>
      </tr>
    </tbody>
  {{/each}}
</trable>
