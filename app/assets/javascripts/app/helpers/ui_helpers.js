Handlebars.registerHelper('whats_this', function(id) {
    return new Handlebars.SafeString('<span title="What\'s This?" class="whats_this" onclick="$.facebox({ div: \'#'+id+'\'})">&nbsp;</span>');
});
