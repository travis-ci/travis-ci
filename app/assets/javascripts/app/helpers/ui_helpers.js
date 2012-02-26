Handlebars.registerHelper('whats_this', function(id) {
    return new Handlebars.SafeString('<span title="What\'s This?" class="whats_this" onclick="$.facebox({ div: \'#'+id+'\'})">&nbsp;</span>');
});
Handlebars.registerHelper('tipsy', function(text, tip) {
  return new Handlebars.SafeString('<span class="tool-tip" original-title="'+tip+'">'+text+'</span>');
});
