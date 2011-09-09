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
SC.ObjectProxy=SC.Object.extend({content:null,unknownProperty:function(a){return console.log(a),this.addProxiedProperty(a),SC.defineProperty(this,a,SC.computed(function(){return this.getPath("content."+a)}).property("content").cacheable()),SC.get(this,a)},addProxiedProperty:function(a){var b=this.proxiedProperties||(this.proxiedProperties=new SC.Set);b.add(a)},contentDidChange:function(){var a=this.proxiedProperties;a&&a.forEach(function(a){this.notifyPropertyChange(a)},this)}.observes("content")})