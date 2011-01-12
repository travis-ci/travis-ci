<table id="builds">
  <tr>
    <th>Build</th>
    <th>Duration</th>
    <th>Finished</th>
  </tr>
  {{#each builds}}
    <tr>
      <td class="number"><a href="#!/{{../repository/name}}/builds/{{id}}">#{{number}}</a></td>
      <td class="duration" title="{{duration}}"></td>
      <td class="finished_at">{{#if finished_at}}{{finished_at}}{{else}}-{{/if}}</td>
    </tr>
  {{/each}}
</table>
