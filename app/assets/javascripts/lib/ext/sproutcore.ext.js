// // Allow adding routes without a target option
// $.extend(SC.routes, {
//   trigger: function() {
//     var firstRoute = this._firstRoute,
//         location = this.get('location'),
//         params, route;
//
//     if (firstRoute) {
//       params = this._extractParametersAndRoute({ route: location });
//       location = params.route;
//       delete params.route;
//       delete params.params;
//       route = firstRoute.routeForParts(location.split('/'), params);
//       // if (route && route.target && route.method) {
//       if (route && route.method) {
//         route.method.call(route.target, params);
//       }
//     }
//  }
// });

// applied to the source:
//
// see https://github.com/sproutcore/sproutcore20/issues/147
// and https://github.com/tchak/sproutcore20/commit/b2c622c164dbbc92f5a164622c27b34dde1a3912
//
// function xformForArgs(args) {
//   return function (target, method, params) {
//     var obj = params[0], keyName = changeKey(params[1]), val;
//     if (method.length>2) val = SC.getPath(obj, keyName);
//     // args.unshift(obj, keyName, val);
//     // method.apply(target, args);
//     method.apply(target, [obj, keyName, val].concat(args));
//   }
// }

SC.ObjectProxy = SC.Object.extend({
  content: null,
  unknownProperty: function(keyName) {
    console.log(keyName)
    this.addProxiedProperty(keyName);
    SC.defineProperty(this, keyName, SC.computed(function() {
      return this.getPath('content.' + keyName);
    }).property('content').cacheable());
    return SC.get(this,keyName);
  },
  addProxiedProperty: function(keyName){
    var proxiedProperties = this.proxiedProperties || (this.proxiedProperties = new SC.Set());
    proxiedProperties.add(keyName);
  },
  contentDidChange: function(){
    var proxiedProperties = this.proxiedProperties;
    if (proxiedProperties){
      proxiedProperties.forEach(function(keyName){
        this.notifyPropertyChange(keyName);
      }, this);
    }
  }.observes('content')
});
