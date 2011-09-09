/*
 * timeago: a jQuery plugin, version: 0.9.2 (2010-09-14)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. '4 minutes ago' or 'about 1 day ago').
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2010, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function(a){function c(c){return c=a(c),(!c.data("timeago")||c.data("timeago").title!=c.attr("title"))&&c.data("timeago",{datetime:b.parse(c.attr("title")),title:c.attr("title")}),c.data("timeago")}function d(a){return b.inWords(e(a))}function e(a){return b.distance(a)}a.timeago=function(b){return b instanceof Date?d(b):typeof b=="string"?d(a.timeago.parse(b)):d(a.timeago.datetime(b))};var b=a.timeago;a.extend(a.timeago,{settings:{refreshMillis:3e3,allowFuture:!0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",numbers:[]}},distanceInWords:function(b){if(!b)return;return typeof b=="string"&&(b=a.timeago.parse(b)),a.timeago.inWords(a.timeago.distance(b))},inWords:function(b){function k(d,e){var f=a.isFunction(d)?d(e,b):d,g=c.numbers&&c.numbers[e]||e;return f.replace(/%d/i,g)}var c=this.settings.strings,d=c.prefixAgo,e=c.suffixAgo;this.settings.allowFuture&&(b<0&&(d=c.prefixFromNow,e=c.suffixFromNow),b=Math.abs(b));var f=b/1e3,g=f/60,h=g/60,i=h/24,j=i/365,l=f<45&&k(c.seconds,Math.round(f))||f<90&&k(c.minute,1)||g<45&&k(c.minutes,Math.round(g))||g<90&&k(c.hour,1)||h<24&&k(c.hours,Math.round(h))||h<48&&k(c.day,1)||i<30&&k(c.days,Math.floor(i))||i<60&&k(c.month,1)||i<365&&k(c.months,Math.floor(i/30))||j<2&&k(c.year,1)||k(c.years,Math.floor(j));return a.trim([d,l,e].join(" "))},distance:function(a){return this.now()-a.getTime()},now:function(){return(new Date).getTime()},parse:function(b){var c=a.trim(b);return c=c.replace(/\.\d\d\d+/,""),c=c.replace(/-/,"/").replace(/-/,"/"),c=c.replace(/T/," ").replace(/Z/," UTC"),c=c.replace(/([\+-]\d\d)\:?(\d\d)/," $1$2"),new Date(c)}}),a.fn.timeago=function(){return this.each(function(){var b=c(this);isNaN(b.datetime)||a(this).text(d(b.datetime))}),this},document.createElement("abbr"),document.createElement("time")})(jQuery)