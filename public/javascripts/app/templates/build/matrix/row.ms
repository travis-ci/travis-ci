<tr class="build {{color}}">
  <td><a href="#!/{{repository/slug}}/builds/{{id}}">{{number}}</a></td>
  {{#each config_table}}
    <td>{{value}}</td>
  {{/each}}
  <td class="finished_at timeago" title="{{finished_at}}">-</td>
  <td class="duration" title="{{duration}}">-</td>
</tr>

