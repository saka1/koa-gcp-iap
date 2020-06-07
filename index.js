"use strict";

const Verifier = require("./verifier");

module.exports = (opts) => {
  const verifier = new Verifier(opts)
  return async (ctx, next) => {
    const iapJwt = ctx.headers["x-goog-iap-jwt-assertion"];
    try {
      await verifier.verify(iapJwt);
    } catch (err) {
      ctx.throw(401);
    }
    await next();
  };
};
