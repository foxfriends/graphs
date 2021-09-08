import React, { ComponentType, Fragment } from "react";

export default function App(
  { Page, pageProps }: { Page: ComponentType<any>; pageProps: any },
) {
  return (
    <Fragment>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta charset="utf-8" />
        <link rel="stylesheet" href="./style/index.css" />
      </head>
      <Page {...pageProps} />
    </Fragment>
  );
}
