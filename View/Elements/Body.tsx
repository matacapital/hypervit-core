import {
  AppConfigType,
  ComponentChildren,
  Container,
  Helper,
  Keys,
} from "../deps.ts";

//@ts-ignore: trust me
export interface IBodyProps extends HTMLAttributes<HTMLBodyElement> {
  children?: ComponentChildren;
  //@ts-ignore: trust me
  scripts?: HTMLAttributes<HTMLScriptElement>[] | string[];
}

export const Body = (
  props: IBodyProps,
) => {
  const appConfig = Container.get(
    Keys.Config.App,
  ) as AppConfigType;

  const scriptsToInject = appConfig.inject?.scripts;

  const { children, scripts } = props;

  return (
    <body {...props}>
      {children}

      {scriptsToInject &&
        scriptsToInject.forEach((s) => {
          return <script src={s} />;
        })}
      {scripts &&
        scripts.forEach((s) => {
          if (Helper.isString(s)) {
            s = { src: s };
          }
          return s.src && <script {...s} src={s.src} />;
        })}
    </body>
  );
};
