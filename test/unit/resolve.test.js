import { RouteProtect } from "../../src/RouteProtect";

describe("RouteProtect - resolve", () => {
  let rp;

  const adminUser = {
    name: "Foo Bar",
    role: "Admin"
  };

  beforeEach(() => {
    rp = new RouteProtect();

    rp.set(adminUser);
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
    expect(mockNext).toHaveBeenCalledWith();
  });

  test("allows access if no permissions", () => {
    const mockNext = jest.fn();

    rp.resolve({ meta: {} }, {}, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
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
    expect(mockNext).toHaveBeenCalledWith();
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
    rp.set(adminUser);

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

    rp.set(adminUser);

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

  test("change in role does not redirect if not matched", () => {
    const router = {
      push: jest.fn()
    };

    rp = new RouteProtect(router);
    rp.set(adminUser);

    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: () => true }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);

    rp.set({
      name: "Foo Bar",
      role: "User"
    });

    expect(router.push).not.toHaveBeenCalled();
  });

  test("change in role does not redirect if still permitted", () => {
    const router = {
      push: jest.fn()
    };

    rp = new RouteProtect(router);
    rp.set(adminUser);

    const targetRoute = {
      meta: {
        permissions: [
          { role: "Admin", access: () => true },
          { role: "User", access: () => true }
        ]
      }
    };

    const mockNext = jest.fn();

    rp.resolve(targetRoute, {}, mockNext);

    rp.set({
      name: "Foo Bar",
      role: "User"
    });

    expect(router.push).not.toHaveBeenCalled();
  });
});
