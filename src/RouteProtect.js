import Vue from "vue";

export class RouteProtect {
  constructor (router) {
    this.router = router;
    this.vm = new Vue({
      data: {
        user: null
      }
    });
  }
  get () {
    if (!this.vm.user) {
      throw new Error("Attempt to access user before being set");
    }
    return this.vm.user;
  }
  set (user) {
    this.vm.user = user;
    if (this.to) {
      const { access, redirect } = this._hasAccessToRoute(this.to);
      if (!access) {
        this.router.push({ name: redirect });
      }
    }
  }
  hasAccess ({ name }) {
    const route = this.router.options.routes.find(r => r.name === name);
    if (!route) {
      throw new Error(`Route ${name} is not defined in the current router`);
    }

    return this._hasAccessToRoute(route).access;
  }
  _hasAccessToRoute (route) {
    if (this.vm.user && route.meta.permissions) {
      const matched = route.meta.permissions.find(item => item.role === this.vm.user.role);
      if (matched) {
        if ((typeof matched.access === "boolean" && !matched.access) ||
            (typeof matched.access === "function" && !matched.access(this.vm.user, route))) {
          return { access: false, redirect: matched.redirect };
        }
      }
    }

    return { access: true };
  }
  resolve (to, from, next) {
    this.to = to;

    const { access, redirect } = this._hasAccessToRoute(to);
    access ? next() : next({ name: redirect });
  }
}
