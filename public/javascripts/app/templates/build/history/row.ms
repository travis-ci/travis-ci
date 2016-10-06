<tr id="builds_{{id}}" class="build {{color}}">
  <td class="number"><a href="#!/{{repository/slug}}/builds/{{id}}">{{number}}</a></td>
  <td class="commit"><a href="http://github.com/{{repository/slug}}/commit/{{commit}}">{{commit}}{{#if branch}} ({{branch}}){{/if}}</a></td>
  <td class="message">{{message}}</td>
  <td class="duration" title="{{duration}}"></td>
  <td class="finished_at timeago" title="{{finished_at}}">{{#if finished_at}}{{finished_at}}{{else}}-{{/if}}</td>
</tr>
