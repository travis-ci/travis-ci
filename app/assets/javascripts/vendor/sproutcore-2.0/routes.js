// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;

/**
  Wether the browser supports HTML5 history.
*/
var supportsHistory = !!(window.history && window.history.pushState);

/**
  Wether the browser supports the hashchange event.
*/
var supportsHashChange = ('onhashchange' in window) && (document.documentMode === undefined || document.documentMode > 7);

/**
  @class

  Route is a class used internally by Ember.routes. The routes defined by your
  application are stored in a tree structure, and this is the class for the
  nodes.
*/
var Route = Ember.Object.extend(
/** @scope Route.prototype */ {

  target: null,

  method: null,

  staticRoutes: null,

  dynamicRoutes: null,

  wildcardRoutes: null,

  add: function(parts, target, method) {
    var part, nextRoute;

    // clone the parts array because we are going to alter it
    parts = Ember.copy(parts);

    if (!parts || parts.length === 0) {
      this.target = target;
      this.method = method;

    } else {
      part = parts.shift();

      // there are 3 types of routes
      switch (part.slice(0, 1)) {

      // 1. dynamic routes
      case ':':
        part = part.slice(1, part.length);
        if (!this.dynamicRoutes) this.dynamicRoutes = {};
        if (!this.dynamicRoutes[part]) this.dynamicRoutes[part] = this.constructor.create();
        nextRoute = this.dynamicRoutes[part];
        break;

      // 2. wildcard routes
      case '*':
        part = part.slice(1, part.length);
        if (!this.wildcardRoutes) this.wildcardRoutes = {};
        nextRoute = this.wildcardRoutes[part] = this.constructor.create();
        break;

      // 3. static routes
      default:
        if (!this.staticRoutes) this.staticRoutes = {};
        if (!this.staticRoutes[part]) this.staticRoutes[part] = this.constructor.create();
        nextRoute = this.staticRoutes[part];
      }

      // recursively add the rest of the route
      if (nextRoute) nextRoute.add(parts, target, method);
    }
  },

  routeForParts: function(parts, params) {
    var part, key, route;

    // clone the parts array because we are going to alter it
    parts = Ember.copy(parts);

    // if parts is empty, we are done
    if (!parts || parts.length === 0) {
      return this.method ? this : null;

    } else {
      part = parts.shift();

      // try to match a static route
      if (this.staticRoutes && this.staticRoutes[part]) {
        return this.staticRoutes[part].routeForParts(parts, params);

      } else {

        // else, try to match a dynamic route
        for (key in this.dynamicRoutes) {
          route = this.dynamicRoutes[key].routeForParts(parts, params);
          if (route) {
            params[key] = part;
            return route;
          }
        }

        // else, try to match a wilcard route
        for (key in this.wildcardRoutes) {
          parts.unshift(part);
          params[key] = parts.join('/');
          return this.wildcardRoutes[key].routeForParts(null, params);
        }

        // if nothing was found, it means that there is no match
        return null;
      }
    }
  }

});

/**
  @class

  Ember.routes manages the browser location. You can change the hash part of the
  current location. The following code

      Ember.routes.set('location', 'notes/edit/4');

  will change the location to http://domain.tld/my_app#notes/edit/4. Adding
  routes will register a handler that will be called whenever the location
  changes and matches the route:

      Ember.routes.add(':controller/:action/:id', MyApp, MyApp.route);

  You can pass additional parameters in the location hash that will be relayed
  to the route handler:

      Ember.routes.set('location', 'notes/show/4?format=xml&language=fr');

  The syntax for the location hash is described in the location property
  documentation, and the syntax for adding handlers is described in the
  add method documentation.

  Browsers keep track of the locations in their history, so when the user
  presses the 'back' or 'forward' button, the location is changed, Ember.route
  catches it and calls your handler. Except for Internet Explorer versions 7
  and earlier, which do not modify the history stack when the location hash
  changes.

  Ember.routes also supports HTML5 history, which uses a '/' instead of a '#'
  in the URLs, so that all your website's URLs are consistent.
*/
var routes = Ember.routes = Ember.Object.create(
  /** @scope Ember.routes.prototype */{

  /**
    Set this property to true if you want to use HTML5 history, if available on
    the browser, instead of the location hash.

    HTML 5 history uses the history.pushState method and the window's popstate
    event.

    By default it is false, so your URLs will look like:

        http://domain.tld/my_app#notes/edit/4

    If set to true and the browser supports pushState(), your URLs will look
    like:

        http://domain.tld/my_app/notes/edit/4

    You will also need to make sure that baseURI is properly configured, as
    well as your server so that your routes are properly pointing to your
    SproutCore application.

    @see http://dev.w3.org/html5/spec/history.html#the-history-interface
    @property
    @type {Boolean}
  */
  wantsHistory: false,

  /**
    A read-only boolean indicating whether or not HTML5 history is used. Based
    on the value of wantsHistory and the browser's support for pushState.

    @see wantsHistory
    @property
    @type {Boolean}
  */
  usesHistory: null,

  /**
    The base URI used to resolve routes (which are relative URLs). Only used
    when usesHistory is equal to true.

    The build tools automatically configure this value if you have the
    html5_history option activated in the Buildfile:

        config :my_app, :html5_history => true

    Alternatively, it uses by default the value of the href attribute of the
    <base> tag of the HTML document. For example:

        <base href="http://domain.tld/my_app">

    The value can also be customized before or during the exectution of the
    main() method.

    @see http://www.w3.org/TR/html5/semantics.html#the-base-element
    @property
    @type {String}
  */
  baseURI: document.baseURI,

  /** @private
    A boolean value indicating whether or not the ping method has been called
    to setup the Ember.routes.

    @property
    @type {Boolean}
  */
  _didSetup: false,

  /** @private
    Internal representation of the current location hash.

    @property
    @type {String}
  */
  _location: null,

  /** @private
    Routes are stored in a tree structure, this is the root node.

    @property
    @type {Route}
  */
  _firstRoute: null,

  /** @private
    An internal reference to the Route class.

    @property
  */
  _Route: Route,

  /** @private
    Internal method used to extract and merge the parameters of a URL.

    @returns {Hash}
  */
  _extractParametersAndRoute: function(obj) {
    var params = {},
        route = obj.route || '',
        separator, parts, i, len, crumbs, key;

    separator = (route.indexOf('?') < 0 && route.indexOf('&') >= 0) ? '&' : '?';
    parts = route.split(separator);
    route = parts[0];
    if (parts.length === 1) {
      parts = [];
    } else if (parts.length === 2) {
      parts = parts[1].split('&');
    } else if (parts.length > 2) {
      parts.shift();
    }

    // extract the parameters from the route string
    len = parts.length;
    for (i = 0; i < len; ++i) {
      crumbs = parts[i].split('=');
      params[crumbs[0]] = crumbs[1];
    }

    // overlay any parameter passed in obj
    for (key in obj) {
      if (obj.hasOwnProperty(key) && key !== 'route') {
        params[key] = '' + obj[key];
      }
    }

    // build the route
    parts = [];
    for (key in params) {
      parts.push([key, params[key]].join('='));
    }
    params.params = separator + parts.join('&');
    params.route = route;

    return params;
  },

  /**
    The current location hash. It is the part in the browser's location after
    the '#' mark.

    The following code

        Ember.routes.set('location', 'notes/edit/4');

    will change the location to http://domain.tld/my_app#notes/edit/4 and call
    the correct route handler if it has been registered with the add method.

    You can also pass additional parameters. They will be relayed to the route
    handler. For example, the following code

        Ember.routes.add(':controller/:action/:id', MyApp, MyApp.route);
        Ember.routes.set('location', 'notes/show/4?format=xml&language=fr');

    will change the location to
    http://domain.tld/my_app#notes/show/4?format=xml&language=fr and call the
    MyApp.route method with the following argument:

        { route: 'notes/show/4',
          params: '?format=xml&language=fr',
          controller: 'notes',
          action: 'show',
          id: '4',
          format: 'xml',
          language: 'fr' }

    The location can also be set with a hash, the following code

        Ember.routes.set('location',
          { route: 'notes/edit/4', format: 'xml', language: 'fr' });

    will change the location to
    http://domain.tld/my_app#notes/show/4?format=xml&language=fr.

    The 'notes/show/4&format=xml&language=fr' syntax for passing parameters,
    using a '&' instead of a '?', as used in SproutCore 1.0 is still supported.

    @property
    @type {String}
  */
  location: function(key, value) {
    this._skipRoute = false;
    return this._extractLocation(key, value);
  }.property(),

  _extractLocation: function(key, value) {
    var crumbs, encodedValue;

    if (value !== undefined) {
      if (value === null) {
        value = '';
      }

      if (typeof(value) === 'object') {
        crumbs = this._extractParametersAndRoute(value);
        value = crumbs.route + crumbs.params;
      }

      if (!Ember.empty(value) || (this._location && this._location !== value)) {
        encodedValue = encodeURI(value);

        if (this.usesHistory) {
          if (encodedValue.length > 0) {
            encodedValue = '/' + encodedValue;
          }
          window.history.pushState(null, null, get(this, 'baseURI') + encodedValue);
        } else {
          window.location.hash = encodedValue;
        }
      }

      this._location = value;
    }

    return this._location;
  },

  /**
    You usually don't need to call this method. It is done automatically after
    the application has been initialized.

    It registers for the hashchange event if available. If not, it creates a
    timer that looks for location changes every 150ms.
  */
  ping: function() {
    var that;

    if (!this._didSetup) {
      this._didSetup = true;

      if (get(this, 'wantsHistory') && supportsHistory) {
        this.usesHistory = true;

        popState();
        jQuery(window).bind('popstate', popState);

      } else {
        this.usesHistory = false;

        if (supportsHashChange) {
          hashChange();
          jQuery(window).bind('hashchange', hashChange);

        } else {
          // we don't use a Ember.Timer because we don't want
          // a run loop to be triggered at each ping
          that = this;
          this._invokeHashChange = function() {
            that.hashChange();
            setTimeout(that._invokeHashChange, 100);
          };
          this._invokeHashChange();
        }
      }
    }
  },

  /**
    Adds a route handler. Routes have the following format:

     - 'users/show/5' is a static route and only matches this exact string,
     - ':action/:controller/:id' is a dynamic route and the handler will be
        called with the 'action', 'controller' and 'id' parameters passed in a
        hash,
     - '*url' is a wildcard route, it matches the whole route and the handler
        will be called with the 'url' parameter passed in a hash.

    Route types can be combined, the following are valid routes:

     - 'users/:action/:id'
     - ':controller/show/:id'
     - ':controller/ *url' (ignore the space, because of jslint)

    @param {String} route the route to be registered
    @param {Object} target the object on which the method will be called, or
      directly the function to be called to handle the route
    @param {Function} method the method to be called on target to handle the
      route, can be a function or a string
  */
  add: function(route, target, method) {
    if (!this._didSetup) {
      Ember.run.once(this, 'ping');
    }

    if (method === undefined && Ember.typeOf(target) === 'function') {
      method = target;
      target = null;
    } else if (Ember.typeOf(method) === 'string') {
      method = target[method];
    }

    if (!this._firstRoute) this._firstRoute = Route.create();
    this._firstRoute.add(route.split('/'), target, method);

    return this;
  },

  /**
    Observer of the 'location' property that calls the correct route handler
    when the location changes.
  */
  locationDidChange: function() {
    this.trigger();
  }.observes('location'),

  /**
    Triggers a route even if already in that route (does change the location, if it
    is not already changed, as well).

    If the location is not the same as the supplied location, this simply lets "location"
    handle it (which ends up coming back to here).
  */
  trigger: function() {
    var location = get(this, 'location'),
        params, route;

    if (this._firstRoute) {
      params = this._extractParametersAndRoute({ route: location });
      location = params.route;
      delete params.route;
      delete params.params;

      route = this.getRoute(location, params);
      if (route && route.method) {
        route.method.call(route.target || this, params);
      }
    }
  },

  getRoute: function(route, params) {
    var firstRoute = this._firstRoute;
    if (params == null) {
      params = {}
    }

    return firstRoute.routeForParts(route.split('/'), params);
  },

  exists: function(route, params) {
    route = this.getRoute(route, params);
    return route != null && route.method != null;
  }

});

/**
  Event handler for the hashchange event. Called automatically by the browser
  if it supports the hashchange event, or by our timer if not.
*/
function hashChange(event) {
  var loc = window.location.hash;

  // Remove the '#' prefix
  loc = (loc && loc.length > 0) ? loc.slice(1, loc.length) : '';

  if (!jQuery.browser.mozilla) {
    // because of bug https://bugzilla.mozilla.org/show_bug.cgi?id=483304
    loc = decodeURI(loc);
  }

  if (get(routes, 'location') !== loc && !routes._skipRoute) {
    Ember.run.once(function() {
      set(routes, 'location', loc);
    });
  }
  routes._skipRoute = false;
}

function popState(event) {
  var base = get(routes, 'baseURI'),
      loc = document.location.href;

  if (loc.slice(0, base.length) === base) {

    // Remove the base prefix and the extra '/'
    loc = loc.slice(base.length + 1, loc.length);

    if (get(routes, 'location') !== loc && !routes._skipRoute) {
      Ember.run.once(function() {
        set(routes, 'location', loc);
      });
    }
  }
  routes._skipRoute = false;
}
