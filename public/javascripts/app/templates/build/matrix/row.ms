<tr class="build {{color}}">
  <td><a href="#!/{{repository/name}}/builds/{{id}}">{{number}}</a></td>
  {{#each config}}
    <td>{{value}}</td>
  {{/each}}
  <td class="finished_at timeago" title="{{finished_at}}">-</td>
  <td class="duration" title="{{duration}}">-</td>
</tr>

