# vue-router-user-roles

![Build status](https://circleci.com/gh/anthonygore/vue-router-user-roles.svg?style=shield&circle-token=:circle-token)
[![Coverage Status](https://coveralls.io/repos/github/anthonygore/vue-router-user-roles/badge.svg?branch=dev)](https://coveralls.io/github/anthonygore/vue-router-user-roles?branch=dev)

[![npm](https://img.shields.io/npm/v/vue-router-user-roles.svg)](https://www.npmjs.com/package/vue-router-user-roles)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

A plugin for Vue.js SPAs that protects routes depending on user role. Add your own authentication.

## :book: Usage

Check out the demo [here](https://github.com/anthonygore/vue-router-user-roles-demo).

### Installation

```bash
$ npm i vue-router-user-roles -D
```

First create a Vue Router instance. It's best to do this in a dedicated file and export as a module e.g.

```js
// router.js

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter(...);
```

Now you can add this plugin in your main file. You must pass in a router instance as an option `router`.

```js
// main.js

import Vue from "vue";
import router from "./router";
import VueRouterUserRoles from "vue-router-user-roles";

Vue.use(VueRouterUserRoles, { router });
```

### Protecting routes

To protect a route, add a `permissions` property to each route configuration object under the `meta` property.

Assign an array of objects to this, with each object defining the permissions for a different user role.

The three properties required for permissions objects are: 
- `role` - the user role being configured for this route.
- `access` - either a boolean, or function returning a boolean, that defines access for the user. A function will have access to two objects: the `user` object and the route being accessed. 
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

const router = new VueRouter(opts);
````

### User

A "user" is an object with one required property: `role`. Typically this would be set to a string e.g. "guest", "admin" etc.

You can add other properties to this object. You may want to do that if route access is determined by a function, since the function is passed this object. For example, you may create an `id` property that could be compared to a route parameter e.g  */user/:id*

Once the plugin is installed, you can access `user` from within your Vue instance or any component as `this.$user`. 

#### Set the user

You can set a user with the `set` method. Here's an example of setting the user before the first instance of Vue is created:

````js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouterUserRoles from "vue-router-user-roles";

Vue.use(VueRouterUserRoles, router);

// This would usually be an AJAX call to the server or a cookie check
// Let's assume the user hasn't logged in yet so they're a guest for now.
let authenticate = Promise.resolve({ role: "guest" });

authenticate.then(user => {
  Vue.prototype.$user.set(user);
  new Vue({
    render: h => h(App),
    router
  }).$mount("#app");
});
````

You'll probably set the user again during the lifecycle of the app. For example, a user may start as a guest, but once they're authenticated their role and permissions will change. 

You can access `user` from within the app as `this.$user` e.g.

```js
export default {
  methods: {
    logIn(username, password) {
      authenticate("/api/user", { username, password })
        .then(user => {
          this.$user.set(Object.assign(user, { role: "registered" }));
        });
    },
    logOut() {
      this.$user.set({ role: "guest" });
    }
  }
}
```

The `user` object is reactive, so each time you set the user, permissions will be reassessed and will potentially redirect the page if the user no longer has access to the current route.

The other API method available is `get`:

````vue
<template>
  <div v-if="$user.get().role === 'guest'">...</div>
</template>
````

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/anthonygore/vue-router-user-roles/blob/dev/CHANGELOG.md).


## :exclamation: Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/anthonygore/vue-router-user-roles/blob/dev/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/anthonygore/vue-router-user-roles/blob/dev/CONTRIBUTING.md) before making a pull request.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
