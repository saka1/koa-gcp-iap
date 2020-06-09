# koa-gcp-iap

![Node.js CI](https://github.com/saka1/koa-gcp-iap/workflows/Node.js%20CI/badge.svg)

A koa middleware to verify requests with the [GCP Identity-Aware Proxy](https://cloud.google.com/iap).

## Install

```sh
npm i koa-gcp-iap
```

## Usage

Insert `iap` middleware before your application.
It needs projectNumber/backendServiceId or projectNumber/projectId, which depends on your runtime environment.

Following application can read `sub` and `email` field from `ctx.iapPayload`.
See <https://cloud.google.com/iap/docs/signed-headers-howto#retrieving_the_user_identity> for more details.

This is a minimal example.

```js
const iap = require("koa-gcp-iap");
const Koa = require("koa");
const app = new Koa();

app.use(
  iap({
    projectNumber: "123456789",
    // projectId: "dummyProjectId",
    backendServiceId: "dummyBackendServiceId",
  })
);

app.use(async (ctx) => {
  ctx.body = `Hello World: ${ctx.iapPayload}`;
});
```
