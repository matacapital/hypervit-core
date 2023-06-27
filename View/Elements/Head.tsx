import { asset } from "../asset.ts";
import {
  AppConfigType,
  ComponentChildren,
  Container,
  Head as FreshHead,
  Keys,
} from "../deps.ts";

// @ts-ignore: trust me
export interface IHeaderProps extends HTMLAttributes<HTMLHeadElement> {
  favicon?: string;
  description?: string;
  styles?: string[];
  children?: ComponentChildren;
  title: string;
}

export const Head = (
  props: IHeaderProps,
) => {
  const appConfig = Container.get(
    Keys.Config.App,
  ) as AppConfigType;

  const stylesToInject = appConfig.inject?.styles;

  const {
    favicon,
    title,
    children,
    styles,
    description,
  } = props;

  delete props.favicon;
  delete props.children;
  delete props.styles;
  // @ts-ignore: trust me
  delete props.title;
  delete props.description;

  return (
    <FreshHead {...props}>
      {favicon &&
        (
          <link
            rel={"icon"}
            type={"image/svg+xml"}
            href={favicon}
          />
        )}

      {description && <meta name={"description"} content={description} />}

      {stylesToInject &&
        stylesToInject.map((style) => (
          <link rel={"stylesheet"} href={asset(style)} />
        ))}

      {styles &&
        styles.map((style) => <link rel={"stylesheet"} href={style} />)}

      <title>{title}</title>
      {children}
    </FreshHead>
  );
};
