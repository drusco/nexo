import { EventEmitter } from "events";

declare namespace Exotic {
  type Traceable = object | FunctionLike;

  interface Emulator extends EventEmitter {
    use(target?: unknown): Proxy;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  interface FunctionLike extends Function {
    (...args: any[]): void;
  }

  interface Proxy extends FunctionLike {
    [x: string]: any;
  }

  namespace proxy {
    interface group {
      length: number;
      root: Exotic.Proxy;
    }

    interface origin {
      action: "get" | "set" | "construct" | "apply";
      item: unknown;
      key?: string;
      value?: unknown;
      that?: unknown;
      args?: unknown[];
    }
  }

  namespace emulator {
    interface options {
      [x: string]: unknown;
    }

    interface bindings {
      [namespace: string]: proxy.group;
    }

    interface private {
      options: options;
      bindings: bindings;
      itemCount: number;
      activeItems: number;
      groupCount: number;
    }

    interface itemPublicData {
      id: number;
      target?: any;
    }

    interface item extends itemPublicData {
      dummy: FunctionLike;
      origin?: proxy.origin | undefined;
      revoke(): void;
      scope: Emulator;
      sandbox: object;
      group?: string;
    }
  }
}

export default Exotic;
