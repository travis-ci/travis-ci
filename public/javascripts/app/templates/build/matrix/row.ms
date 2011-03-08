<tr class="build {{color}}">
  <td><a href="#!/{{repository/name}}/builds/{{id}}">{{number}}</a></td>
  {{#each config}}
    <td>{{value}}</td>
  {{/each}}
  <td>{{finished_at}}</td>
  <td>{{duration}}</td>
</tr>

