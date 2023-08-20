import Exotic from "../types/Exotic.js";
import map from "./map.js";

const findProxy = (value: any): Exotic.Proxy | undefined => {
  if (map.proxies.has(value)) return value; // value is already a proxy
  if (map.targets.has(value)) return map.targets.get(value); // return proxy linked to value
  if (map.mocks.has(value)) return map.mocks.get(value); // return proxy linked to mock
  return;
};

export default findProxy;
