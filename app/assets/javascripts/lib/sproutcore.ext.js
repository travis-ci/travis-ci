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
