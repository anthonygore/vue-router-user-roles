import { RouteProtect } from './RouteProtect';

function plugin (Vue, router) {
  let rp = new RouteProtect(router);
  Vue.prototype.$user = rp;
  router.beforeEach((to, from, next) => rp.resolve(to, from, next));
}

plugin.version = '__VERSION__'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
