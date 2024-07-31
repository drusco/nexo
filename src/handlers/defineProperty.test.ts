import Nexo from "../Nexo.js";
import defineProperty from "./defineProperty.js";
import ProxyEvent from "../events/ProxyEvent.js";
import map from "../utils/maps.js";
import isProxy from "../utils/isProxy.js";
import ProxyWrapper from "../utils/ProxyWrapper.js";

describe("defineProperty", () => {
  it("Emits a defineProperty event", () => {
    const nexo = new Nexo();
    const proxy = nexo.create();
    const wrapper = new ProxyWrapper(proxy);

    const definePropertyCallbackNexo = jest.fn();
    const definePropertyCallbackProxy = jest.fn();

    nexo.events.on("nx.proxy.defineProperty", definePropertyCallbackNexo);
    wrapper.events.on("nx.proxy.defineProperty", definePropertyCallbackProxy);

    const result = defineProperty(wrapper.fn, "foo", { value: "bar" });

    const [definePropertyEventForNexo] =
      definePropertyCallbackNexo.mock.lastCall;
    const [definePropertyEventForProxy] =
      definePropertyCallbackProxy.mock.lastCall;

    expect(result).toBe(true);
    expect(definePropertyCallbackNexo).toHaveBeenCalledTimes(1);
    expect(definePropertyEventForNexo.target).toBe(proxy);
    expect(definePropertyEventForNexo.cancellable).toBe(true);

    expect(definePropertyEventForNexo.data).toStrictEqual({
      key: "foo",
      descriptor: {
        value: "bar",
      },
    });

    expect(definePropertyCallbackProxy).toHaveBeenCalledTimes(1);
    expect(definePropertyEventForProxy).toBe(definePropertyEventForNexo);
  });

  it("Returns false when the event is default prevented", () => {
    const nexo = new Nexo();
    const proxy = nexo.create();
    const wrapper = new ProxyWrapper(proxy);

    wrapper.events.on(
      "nx.proxy.defineProperty",
      (event: ProxyEvent<{ key: string; descriptor: PropertyDescriptor }>) => {
        event.preventDefault();
      },
    );

    const result = defineProperty(wrapper.fn, "foo");

    expect(result).toBe(false);
    expect(proxy.foo).toBeUndefined(); // should throw an error later on
  });

  it("Converts traceable values to proxies", () => {
    const nexo = new Nexo();
    const proxy = nexo.create();
    const wrapper = new ProxyWrapper(proxy);
    const data = map.proxies.get(proxy);

    const key = "foo";
    const descriptor: PropertyDescriptor = { value: [] };

    const result = defineProperty(wrapper.fn, key, descriptor);
    const fooDescriptor = data?.sandbox.get(key);

    expect(result).toBe(true);
    expect(isProxy(fooDescriptor?.value)).toBe(true);

    expect(fooDescriptor).toStrictEqual({
      value: nexo.create(descriptor.value),
    });
  });
});
