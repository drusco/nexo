import Exotic from "../../types/Exotic.js";
import { findProxy, map } from "../../utils/index.js";

export default function ownKeys(value?: Exotic.traceable): Exotic.key[] {
  const proxy = findProxy(value);
  if (!proxy) return [];
  const { sandbox } = map.proxies.get(proxy);
  return Reflect.ownKeys(sandbox);
}
