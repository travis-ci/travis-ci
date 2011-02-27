var repositoriesListPopulated = function(count) { return function() { return $('#repositories .repository').length >= count; }; };
var jobsListPopulated         = function(count) { return function() { return $('#jobs li:not(.empty)').length >= count; }; };
var buildHistoryContainsRows  = function(count) { return function() { return $('#main #builds tbody tr').length >= count; }; };
var buildTabActive       = function(title, tab) { return function() { return $('#main #tab_' + tab + '.active').length > 0 && $('#main h3').text() == title; }; };


