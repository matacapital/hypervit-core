const decoder = new TextDecoder("utf-8");
const data = Deno.readFileSync(`./ServerError.css`);
const style = decoder.decode(data);

export const ServerErrorView = () => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Server error</title>
        <style>{style}</style>
      </head>
      <body>
        <header>
          <h1>Main Page Title</h1>
        </header>
      </body>
    </html>
  );
};
