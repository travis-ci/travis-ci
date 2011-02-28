var repositoriesListPopulated = function(count) { return function() { return $('#repositories .repository').length >= count; }; };
var jobsListPopulated         = function(count) { return function() { return $('#jobs li:not(.empty)').length >= count; }; };
var buildHistoryTimesUpdated  = function()      { return function() { return $('#main #builds tbody').html().match(/\d+ sec/) } }
var buildHistoryShowsBuilds   = function(count) { return function() { return $('#main #builds tbody tr').length >= count; }; };
var buildTabActive       = function(title, tab) { return function() { return $('#main #tab_' + tab + '.active').length > 0 && $('#main h3').text() == title; }; };
var buildTabLoaded       = function(title, tab) { return function() { return $('#main #tab_' + tab + '.active .loading').length == 0 }; };


