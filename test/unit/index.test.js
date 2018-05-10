import Vue from "vue";
import plugin from "../../src";

test("plugin requires router instance", () => {
  expect(() => plugin({}, {})).toThrowError("You must supply a router instance in the options.");
});

test("adds RouteProtect to Vue prototype", () => {
  const router = {
    beforeEach: jest.fn()
  };

  plugin(Vue, { router });

  expect(Vue.prototype.$user).toBeDefined();
});
