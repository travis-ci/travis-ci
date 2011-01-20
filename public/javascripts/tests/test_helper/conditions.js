var repositories_list_populated = function(count) { return function() { return $('#repositories .repository').length >= count; }; };
var jobs_list_populated         = function(count) { return function() { return $('#jobs .job').length >= count; }; };
var build_history_contains_rows = function(count) { return function() { return $('#main #builds tr').length >= count; }; };
var build_tab_active = function(title, tab) { return function() { return $('#main #tab_' + tab + '.active').length > 0 && $('#main h3').text() == title; }; };


