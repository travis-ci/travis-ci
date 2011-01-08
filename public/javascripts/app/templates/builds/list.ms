<table>
  <tr>
    <th>Build</th>
    <th>Duration</th>
    <th>Finished</th>
  </tr>
  {{#each builds}}
    <tr>
      <td><a href="#!/repositories/{{../repository_id}}/builds/{{id}}">#{{number}}</a></td>
      <td class="duration" title="{{duration}}"></td>
      <td>{{#if finished_at}}{{finished_at}}{{else}}-{{/if}}</td>
    </tr>
  {{/each}}
</table>
