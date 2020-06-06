"use strict";

const verifier = require("./verifier");

module.exports = () => {
  //TODO pass opts
  return async (ctx, next) => {
    const iapJwt = ctx.headers["x-goog-iap-jwt-assertion"];
    try {
      //TODO replace
      await verifier(iapJwt, "projectNumber", "projectId", "backendServiceId");
    } catch (err) {
      ctx.throw(401);
    }
    await next();
  };
};
