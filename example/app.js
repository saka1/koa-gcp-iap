
const iap = require('../');

const Koa = require("koa");
const app = new Koa();

app.use(iap());

app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.listen(3000);
