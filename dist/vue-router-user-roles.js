/*!
 * vue-router-user-roles v0.1.92 
 * (c) 2019 Anthony Gore
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global.VueRouterUserRoles = factory(global.Vue));
}(this, (function (Vue) { 'use strict';

Vue = 'default' in Vue ? Vue['default'] : Vue;

var RouteProtect = function RouteProtect (router) {
  this.router = router;
  this.vm = new Vue({
    data: {
      user: null
    }
  });
};
RouteProtect.prototype.get = function get () {
  if (!this.vm.user) {
    throw new Error("Attempt to access user before being set");
  }
  return this.vm.user;
};
RouteProtect.prototype.set = function set (user) {
  this.vm.user = user;
  if (this.to) {
    var ref = this._hasAccessToRoute(this.to);
      var access = ref.access;
      var redirect = ref.redirect;
    if (!access) {
      this.router.push({ name: redirect });
    }
  }
};
RouteProtect.prototype.hasAccess = function hasAccess (ref) {
    var name = ref.name;

  var route = this.router.options.routes.find(function (r) { return r.name === name; });
  if (!route) {
    throw new Error(("Route " + name + " is not defined in the current router"));
  }

  return this._hasAccessToRoute(route).access;
};
RouteProtect.prototype._hasAccessToRoute = function _hasAccessToRoute (route) {
    var this$1 = this;

  if (this.vm.user && route.meta.permissions) {
    var matched = route.meta.permissions.find(function (item) { return item.role === this$1.vm.user.role; });
    if (matched) {
      if ((typeof matched.access === "boolean" && !matched.access) ||
          (typeof matched.access === "function" && !matched.access(this.vm.user, route))) {
        return { access: false, redirect: matched.redirect };
      }
    }
  }

  return { access: true };
};
RouteProtect.prototype.resolve = function resolve (to, from, next) {
  this.to = to;

  var ref = this._hasAccessToRoute(to);
    var access = ref.access;
    var redirect = ref.redirect;
  access ? next() : next({ name: redirect });
  };

function plugin (Vue$$1, opts) {
  if (!opts.router) {
    throw new Error("You must supply a router instance in the options.");
  }
  var rp = new RouteProtect(opts.router);
  Vue$$1.prototype.$user = rp;
  opts.router.beforeEach(function (to, from, next) { return rp.resolve(to, from, next); });
}

plugin.version = "0.1.92";

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(plugin);
}

return plugin;

})));
