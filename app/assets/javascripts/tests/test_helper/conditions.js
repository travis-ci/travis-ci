var repositoriesFetched       = function(count) { return function() { return Travis.app.repositories.fetched; }; };
var buildsFetched        = function(repository) { return function() { return repository.builds.fetched; } }
var repositoriesListPopulated = function(count) { return function() { return $('#repositories .repository').length >= (count || 1); }; };
var repositoryRendered        = function()      { return function() { return $('#main .repository h3').text() != ''; }; };
var tabRendered               = function(tab)   { return function() { return tab == 'history' ? $('#main #builds tbody').children().length > 0 : $('#main #tab_' + tab + ' .tab div').children().length > 0; }; };
var jobsListPopulated         = function(count) { return function() { return $('#jobs li:not(.empty)').length >= count; }; };
var buildHistoryTimesUpdated  = function()      { return function() { return $('#main #builds tbody').html().match(/\d+ sec/) } }
var buildHistoryShowsBuilds   = function(count) { return function() { return $('#main #builds tbody tr').length >= count; }; };
var buildTabActive       = function(title, tab) { return function() { return $('#main #tab_' + tab + '.active').length > 0 && $('#main h3').text() == title; }; };
var buildTabLoaded       = function(title, tab) { return function() { return $('#main #tab_' + tab + '.active .loading').length == 0 }; };


