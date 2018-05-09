import { RouteProtect } from "../../src/RouteProtect";

let rp;

describe("RouteProtect - resolve", () => {
  beforeEach(() => {
    rp = new RouteProtect();

    const user = {
      name: "Foo Bar",
      role: "Admin"
    };

    rp.set(user);
  });

  test("allows access if in role", () => {
    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: true }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test("allows access if no permissions", () => {
    const mockNext = jest.fn();

    rp.resolve({ meta: {} }, {}, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test("allows access if no role match", () => {
    const targetRoute = {
      meta: {
        permissions: [
          { role: "User", access: false, redirect: "NotAllowed" }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test("redirects if access denied", () => {
    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: false, redirect: "NotAllowed" }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);
    expect(mockNext).toHaveBeenCalledWith({ "name": "NotAllowed" });
  });

  test("redirects if access denied - access function", () => {
    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: () => false, redirect: "NotAllowed" }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);
    expect(mockNext).toHaveBeenCalledWith({ "name": "NotAllowed" });
  });

  test("change in role redirects if not permitted", () => {
    const router = {
      push: jest.fn()
    };

    rp = new RouteProtect(router);

    const user = {
      name: "Foo Bar",
      role: "Admin"
    };

    rp.set(user);

    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: true },
          { role: "User", access: false, redirect: "NotAllowed" }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);

    rp.set({
      name: "Foo Bar",
      role: "User"
    });

    expect(router.push).toHaveBeenCalledWith({ "name": "NotAllowed" });
  });

  test("change in role redirects if not permitted - access function", () => {
    const router = {
      push: jest.fn()
    };

    rp = new RouteProtect(router);

    const user = {
      name: "Foo Bar",
      role: "Admin"
    };

    rp.set(user);

    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: () => true },
          { role: "User", access: () => false, redirect: "NotAllowed" }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);

    rp.set({
      name: "Foo Bar",
      role: "User"
    });

    expect(router.push).toHaveBeenCalledWith({ "name": "NotAllowed" });
  });
});
