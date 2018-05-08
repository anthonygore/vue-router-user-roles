# Installation

Add it like any Vue plugin, however, you must pass in a router instance.
````js
// router.js
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new Router(...);

// main.js
import Vue from "vue";
import router from "./router";
import VueRouterPermissions from "vue-router-permissions";

Vue.use(VueRouterPermissions, router);
````

# Usage

## Protecting routes

To protect a route, add a `permissions` property to your route configuration under the `meta` property of the route.

Assign an array of objects to this, with each object defining the permissions for a different user role. We'll set user roles in the next section.

The three properties required are: 
- `role` - the user role in question
- `access` - either a `boolean` or `function` returning a boolean that determines the access for the user. The function will have access to two objects: the `user` object and the route the user is attempting to access. 
- `redirect` - a route name you wish to redirect to if the user does not have access.

````js
let opts = {
  routes: [
    {
      path: "/protected",
      name: "protected",
      component: Protected,
      meta: {
        permissions: [
          {
            role: "guest",
            access: false,
            redirect: "login"
          }
        ]
      }
    },
    {
      path: "/profile/:id",
      name: "profile",
      component: Profile,
      meta: {
        permissions: [
          {
            role: "registered",
            access: (user, to) => user.id === to.params.id,
            redirect: "login"
          },
          {
            role: "guest",
            access: false,
            redirect: "login"
          }
        ]
      }
    }
  ]
};
new VueRouter(opts);
````

## Setting a user

A "user" is nothing more than an object with one required property: `role`. Routes are protected based on the user's role. Typically this would be set to a string e.g. "guest", "admin" etc.

You can add any other properties to this object, though, which may be used to determine the user's access. For example, you may give registered users an ID. They may only be able to visit routes that permit that ID e.g. */user/:id*

Once the plugin is installed, you can access `user` from within your Vue instance or any component as `this.$protect.user`. You may like to set your user before an instance is created, though, in which case, access is provided through `Vue.prototype.$protect.user`.

Here's an example of setting the user before the instance is created:

````js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouterPermissions from "vue-router-permissions";

Vue.use(VueRouterPermissions, router);

// This would usually be an AJAX call to the server or a cookie check
let getUser = Promise.resolve({ role: "guest" });

getUser.then(user => {
  Vue.prototype.$protect.user = user;
  new Vue({
    render: h => h(App),
    router
  }).$mount("#app");
});
````

You can then change the user whenever necessary. For example, a user may start as a guest, but once they're logged in, they have some other role. This will automatically reassess permissions and will potentially redirect the page is the user no longer has permissions to the current route.

```js
export default {
  methods: {
    logIn(username, password) {
      getUser("/api/user", { username, password })
        .then(user => {
          this.$protect.user = user;
        });
    },
    logOut() {
      this.$protect.user = { role: "guest" };
    }
  }
}
```

Note that `user` is reactive, so you can use it in templates etc

````vue
<template>
  <div v-if="$protect.user.role === 'guest'">...</div>
</template>
````
