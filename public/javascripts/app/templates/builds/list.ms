<table id="builds">
  <thead>
    <tr>
      <th>Build</th>
      <th>Commit</th>
      <th>Message</th>
      <th>Duration</th>
      <th>Finished</th>
    </tr>
  </thead>
  <tbody>
  {{#each builds}}
    {{> builds_item}}
  {{/each}}
  </tbody>
</table>
