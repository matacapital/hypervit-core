import { EnvHelper } from "../deps.ts";

// @ts-ignore: trust me
export const Page = (props: HTMLAttributes<HTMLHtmlElement>) => {
  const { lang = EnvHelper.getLocale(), children } = props;
  delete props.children;

  return (
    <html {...props} lang={lang}>
      {children}
    </html>
  );
};
