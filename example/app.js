"use strict";

const iap = require("../");

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

app.listen(3000);
