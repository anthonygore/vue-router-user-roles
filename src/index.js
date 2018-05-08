import { RouteProtect } from './RouteProtect';

function plugin (Vue, router) {
  let protect = new RouteProtect(router);
  Vue.prototype.$protect = protect;
  router.beforeEach((to, from, next) => protect.resolve(to, from, next));
}

plugin.version = '__VERSION__'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
