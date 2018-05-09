import { RouteProtect } from "../../src/RouteProtect";

let rp;

describe("RouteProtect - user", () => {
  beforeEach(() => { rp = new RouteProtect(); });

  test("cannot access user before set", () => {
    expect(() => rp.get()).toThrowError("Attempt to access user before being set");
  });

  test("get returns set user", () => {
    const user = {
      name: "Foo Bar"
    };

    rp.set(user);
    expect(rp.get()).toBe(user);
  });
});
