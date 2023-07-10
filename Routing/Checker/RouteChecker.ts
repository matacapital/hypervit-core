import { Helper, HttpProtocolType, HttpStatusType } from "../deps.ts";
import { RouteDefinitionType } from "../Route/types.ts";
import { MatchedRouteType } from "../types.ts";
import { RouteCheckerException } from "./RouteCheckerException.ts";

export class RouteChecker {
  constructor(
    private route: RouteDefinitionType,
    private matchedRoute: MatchedRouteType,
  ) {
    this.checkMethod();
    this.checkIp();
    this.checkLocale();
    this.checkEnv();
    this.checkVersion();
    this.checkHostname();
    this.checkProtocol();
    this.checkPort();
    this.checkConstraints();
  }

  public checkMethod(): true {
    const methods = this.route.methods;
    if (!methods) {
      return true;
    }

    const method = this.matchedRoute.method;

    if (method && methods.includes(method)) {
      return true;
    }

    throw new RouteCheckerException(
      `Method "${method}" not allowed`,
      HttpStatusType.MethodNotAllowed,
    );
  }

  public checkIp(): true {
    const ips = this.route.ips;
    if (!ips) {
      return true;
    }

    const ip = this.matchedRoute.ip;

    if (ip && ips.includes(ip)) {
      return true;
    }

    throw new RouteCheckerException(
      `IP "${ip}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkLocale(): true {
    const locales = this.route.locales;
    if (!locales) {
      return true;
    }

    const locale = this.matchedRoute.locale;

    if (locale && locales.includes(locale)) {
      return true;
    }

    throw new RouteCheckerException(
      `Locale "${locale}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkEnv(): true {
    const envs = this.route.envs;
    if (!envs) {
      return true;
    }

    const env = this.matchedRoute.env;

    if (env && envs.includes(env)) {
      return true;
    }

    throw new RouteCheckerException(
      `Env "${env}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkVersion(): true {
    const versions = this.route.versions;
    if (!versions) {
      return true;
    }

    const version = this.matchedRoute.version;

    if (version && versions.includes(version)) {
      return true;
    }

    throw new RouteCheckerException(
      `Version "${version}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkHostname(): true {
    const hosts = this.route.hosts;
    if (!hosts) {
      return true;
    }

    const url = this.matchedRoute.url;
    const host = url.hostname;

    if (host && hosts.includes(host)) {
      return true;
    }

    throw new RouteCheckerException(
      `Host "${host}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkProtocol(): true {
    const protocols = this.route.protocols;
    if (!protocols) {
      return true;
    }

    const url = this.matchedRoute.url;
    const protocol = Helper.trim(url.protocol, ":") as HttpProtocolType;

    if (protocol && protocols.includes(protocol)) {
      return true;
    }

    throw new RouteCheckerException(
      `Protocol "${protocol}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkPort(): true {
    const ports = this.route.ports;
    if (!ports) {
      return true;
    }

    const url = this.matchedRoute.url;
    const p = url.port;
    let port: number | null = null;

    if (p) {
      port = Number(p);
    }

    if (port && ports.includes(port)) {
      return true;
    }

    throw new RouteCheckerException(
      `Port "${port}" not matched`,
      HttpStatusType.NotAcceptable,
    );
  }

  public checkConstraints(): true {
    const constraints = this.route.constraints;
    if (!constraints) {
      return true;
    }

    const params = {
      ...this.route.default ?? {},
      ...this.matchedRoute.params ?? {},
    };

    // Check where constraints
    const whereConstraints = constraints.where ?? {};
    Object.keys(whereConstraints).map((key) => {
      if (!Helper.hasProperty(params, key)) {
        throw new RouteCheckerException(
          `[where] "${key}" param missing`,
          HttpStatusType.NotAcceptable,
        );
      }
      // @ts-ignore: trust me
      if (`${params[key]}` !== `${whereConstraints[key]}`) {
        throw new RouteCheckerException(
          `"${key}" param must be equal to ${whereConstraints[key]}`,
          HttpStatusType.NotAcceptable,
        );
      }
    });

    // Check regex constraints
    const regexConstraints = constraints.regex ?? {};
    Object.keys(regexConstraints).map((key) => {
      if (!Helper.hasProperty(params, key)) {
        throw new RouteCheckerException(
          `"${key}" param missing`,
          HttpStatusType.NotAcceptable,
        );
      }

      // @ts-ignore: trust me
      if (!regexConstraints[key].test(`${params[key]}`)) {
        throw new RouteCheckerException(
          `"${key}" param must match with "${regexConstraints[key]}"`,
          HttpStatusType.NotAcceptable,
        );
      }
    });

    // Check number constraints
    const numberConstraints = constraints.number ?? [];
    numberConstraints.map((key) => {
      if (!Helper.hasProperty(params, key)) {
        throw new RouteCheckerException(
          `"${key}" param missing`,
          HttpStatusType.NotAcceptable,
        );
      }

      const reg = /^[0-9]+$/;

      // @ts-ignore: trust me
      if (!reg.test(`${params[key]}`)) {
        throw new RouteCheckerException(
          `"${key}" param must match with "${reg}"`,
          HttpStatusType.NotAcceptable,
        );
      }
    });

    // Check alphaNumeric constraints
    const alphaNumericConstraints = constraints.alphaNumeric ?? [];
    alphaNumericConstraints.map((key) => {
      if (!Helper.hasProperty(params, key)) {
        throw new RouteCheckerException(
          `"${key}" param missing`,
          HttpStatusType.NotAcceptable,
        );
      }

      const reg = /^[a-z0-9]+$/;

      // @ts-ignore: trust me
      const p = params[key];

      if (
        !reg.test(`${p}`) || !/[a-z]+/.test(`${p}`) ||
        !/[0-9]+/.test(`${p}`)
      ) {
        throw new RouteCheckerException(
          `"${key}" param must match with "${/[a-z]+/}" and "${/[0-9]+/}"`,
          HttpStatusType.NotAcceptable,
        );
      }
    });

    // Check in constraints
    const inConstraints = constraints.in ?? {};
    Object.keys(inConstraints).map((key) => {
      if (!Helper.hasProperty(params, key)) {
        throw new RouteCheckerException(
          `"${key}" param missing`,
          HttpStatusType.NotAcceptable,
        );
      }

      // @ts-ignore: trust me
      if (!inConstraints[key].includes(params[key])) {
        throw new RouteCheckerException(
          `"${key}" param must equal to " ${
            inConstraints[key].join('" or "')
          }"`,
          HttpStatusType.NotAcceptable,
        );
      }
    });

    return true;
  }
}
