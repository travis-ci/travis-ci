// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @class

  SC.routes manages the browser location. You can change the hash part of the
  current location. The following code

      SC.routes.set('location', 'notes/edit/4');

  will change the location to http://domain.tld/my_app#notes/edit/4. Adding
  routes will register a handler that will be called whenever the location
  changes and matches the route:

      SC.routes.add(':controller/:action/:id', MyApp, MyApp.route);

  You can pass additional parameters in the location hash that will be relayed
  to the route handler:

      SC.routes.set('location', 'notes/show/4?format=xml&language=fr');

  The syntax for the location hash is described in the location property
  documentation, and the syntax for adding handlers is described in the
  add method documentation.

  Browsers keep track of the locations in their history, so when the user
  presses the 'back' or 'forward' button, the location is changed, SC.route
  catches it and calls your handler. Except for Internet Explorer versions 7
  and earlier, which do not modify the history stack when the location hash
  changes.

  SC.routes also supports HTML5 history, which uses a '/' instead of a '#'
  in the URLs, so that all your website's URLs are consistent.
*/
SC.routes=SC.Object.create({wantsHistory:NO,usesHistory:null,baseURI:document.baseURI,_didSetup:NO,_location:null,_firstRoute:null,_extractParametersAndRoute:function(a){var b={},c=a.route||"",d,e,f,g,h,i;d=c.indexOf("?")<0&&c.indexOf("&")>=0?"&":"?",e=c.split(d),c=e[0],e.length===1?e=[]:e.length===2?e=e[1].split("&"):e.length>2&&e.shift(),g=e.length;for(f=0;f<g;++f)h=e[f].split("="),b[h[0]]=h[1];for(i in a)a.hasOwnProperty(i)&&i!=="route"&&(b[i]=""+a[i]);e=[];for(i in b)e.push([i,b[i]].join("="));return b.params=d+e.join("&"),b.route=c,b},location:function(a,b){return this._skipRoute=NO,this._extractLocation(a,b)}.property(),informLocation:function(a,b){this._skipRoute=YES;var c=this.location.lastSetValueKey;return c&&this._kvo_cache&&(this._kvo_cache[c]=b),this._extractLocation(a,b)}.property(),_extractLocation:function(a,b){var c,d;if(b!==undefined){b===null&&(b=""),typeof b=="object"&&(c=this._extractParametersAndRoute(b),b=c.route+c.params);if(!SC.empty(b)||this._location&&this._location!==b)d=encodeURI(b),this.usesHistory?(d.length>0&&(d="/"+d),window.history.pushState(null,null,this.get("baseURI")+d)):window.location.hash=d;this._location=b}return this._location},ping:function(){var a;this._didSetup||(this._didSetup=YES,this.get("wantsHistory")&&SC.platform.supportsHistory?(this.usesHistory=YES,this.popState(),SC.Event.add(window,"popstate",this,this.popState)):(this.usesHistory=NO,SC.platform.supportsHashChange?(this.hashChange(),SC.Event.add(window,"hashchange",this,this.hashChange)):(a=this,this._invokeHashChange=function(){a.hashChange(),setTimeout(a._invokeHashChange,100)},this._invokeHashChange())))},hashChange:function(a){var b=window.location.hash;b=b&&b.length>0?b.slice(1,b.length):"",SC.browser.isMozilla||(b=decodeURI(b)),this.get("location")!==b&&!this._skipRoute&&SC.run(this,function(){this.set("location",b)}),this._skipRoute=!1},popState:function(a){var b=this.get("baseURI"),c=document.location.href;c.slice(0,b.length)===b&&(c=c.slice(b.length+1,c.length),this.get("location")!==c&&!this._skipRoute&&SC.run(this,function(){this.set("location",c)})),this._skipRoute=!1},add:function(a,b,c){return this._didSetup||SC.run.schedule("sync",this,this.ping),c===undefined&&SC.typeOf(b)==="function"?(c=b,b=null):SC.typeOf(c)==="string"&&(c=b[c]),this._firstRoute||(this._firstRoute=this._Route.create()),this._firstRoute.add(a.split("/"),b,c),this},locationDidChange:function(){this.trigger()}.observes("location"),trigger:function(){var a=this._firstRoute,b=this.get("location"),c,d;a&&(c=this._extractParametersAndRoute({route:b}),b=c.route,delete c.route,delete c.params,d=a.routeForParts(b.split("/"),c),d&&d.method&&d.method.call(d.target||this,c))},_Route:SC.Object.extend({target:null,method:null,staticRoutes:null,dynamicRoutes:null,wildcardRoutes:null,add:function(a,b,c){var d,e;a=Array.prototype.slice.call(a);if(!a||a.length===0)this.target=b,this.method=c;else{d=a.shift();switch(d.slice(0,1)){case":":d=d.slice(1,d.length),this.dynamicRoutes||(this.dynamicRoutes={}),this.dynamicRoutes[d]||(this.dynamicRoutes[d]=this.constructor.create()),e=this.dynamicRoutes[d];break;case"*":d=d.slice(1,d.length),this.wildcardRoutes||(this.wildcardRoutes={}),e=this.wildcardRoutes[d]=this.constructor.create();break;default:this.staticRoutes||(this.staticRoutes={}),this.staticRoutes[d]||(this.staticRoutes[d]=this.constructor.create()),e=this.staticRoutes[d]}e&&e.add(a,b,c)}},routeForParts:function(a,b){var c,d,e;a=Array.prototype.slice.call(a);if(!a||a.length===0)return this.method?this:null;c=a.shift();if(this.staticRoutes&&this.staticRoutes[c])return this.staticRoutes[c].routeForParts(a,b);for(d in this.dynamicRoutes){e=this.dynamicRoutes[d].routeForParts(a,b);if(e)return b[d]=c,e}for(d in this.wildcardRoutes)return a.unshift(c),b[d]=a.join("/"),this.wildcardRoutes[d].routeForParts(null,b);return null}})})