<table id="builds">
  <tr>
    <th>Build</th>
    <th>Duration</th>
    <th>Finished</th>
  </tr>
  {{#each builds}}
    {{> builds_item}}
  {{/each}}
</table>
