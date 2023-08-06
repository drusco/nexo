import Emulator from "../../Emulator";
const $ = new Emulator();

describe("(getter) length", () => {
  it("Returns the number of built proxies", () => {
    const total = $.length;
    $.use();
    expect($.length).toBe(total + 1);
  });
});
