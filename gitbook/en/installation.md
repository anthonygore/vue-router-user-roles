# Installation

### Direct Download / CDN

https://unpkg.com/vue-router-permissions/dist/vue-router-permissions

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue-router-permissions@0.1.0/dist/vue-router-permissions.js
 
Include vue-router-permissions after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router-permissions/dist/vue-router-permissions.js"></script>
```

### NPM

    $ npm install vue-router-permissions

### Yarn

    $ yarn add vue-router-permissions

When used with a module system, you must explicitly install the `vue-router-permissions` via `Vue.use()`:

```javascript
import Vue from 'vue'
import VueRouterPermissions from 'vue-router-permissions'

Vue.use(VueRouterPermissions)
```

You don't need to do this when using global script tags.

### Dev Build

You will have to clone directly from GitHub and build `vue-router-permissions` yourself if
you want to use the latest dev build.

    $ git clone https://github.com/anthonygore/vue-router-permissions.git node_modules/vue-router-permissions
    $ cd node_modules/vue-router-permissions
    $ npm install
    $ npm run build
