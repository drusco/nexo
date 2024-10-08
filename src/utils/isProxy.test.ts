import Nexo from "../Nexo.js";
import isProxy from "./isProxy.js";

const nexo = new Nexo();

describe("isProxy", () => {
  it("Returns true when the parameter is a proxy", () => {
    const proxy = nexo.create();
    const result = isProxy(proxy);

    expect(result).toBe(true);
  });

  it("Returns false when the parameter is not a proxy", () => {
    expect(isProxy(undefined)).toBe(false);
    expect(isProxy(NaN)).toBe(false);
    expect(isProxy(null)).toBe(false);
    expect(isProxy("foo")).toBe(false);
    expect(isProxy(() => {})).toBe(false);
    expect(isProxy({})).toBe(false);
    expect(isProxy([])).toBe(false);
    expect(isProxy(true)).toBe(false);
  });
});
