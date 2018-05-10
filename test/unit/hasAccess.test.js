import { RouteProtect } from "../../src/RouteProtect";

describe("RouteProtect.hasAccess", () => {
  let rp;

  beforeEach(() => {
    const router = {
      options: {
        routes: [
          {
            name: "protected",
            meta: {
              permissions: [
                { role: "Admin", access: true },
                { role: "User", access: false }
              ]
            }
          }
        ]
      }
    };

    rp = new RouteProtect(router);
  });

  test("has access when access === true", () => {
    rp.set({
      name: "Foo Bar",
      role: "Admin"
    });

    expect(rp.hasAccess({ name: "protected" }).access).toEqual(true);
  });

  test("throws error when route not defined", () => {
    rp.set({
      name: "Foo Bar",
      role: "Admin"
    });

    expect(() => rp.hasAccess({ name: "missing" })).toThrowError("Route missing is not defined in the current router");
  });
});


