"use strict";

const { OAuth2Client } = require("google-auth-library");
const debug = require("debug")("koa-gcp-iap:verifier");

class Verifier {
  constructor({ projectNumber, projectId, backendServiceId }) {
    this.expectedAudience = null;
    if (projectNumber && projectId) {
      // Expected Audience for App Engine.
      this.expectedAudience = `/projects/${projectNumber}/apps/${projectId}`;
    } else if (projectNumber && backendServiceId) {
      // Expected Audience for Compute Engine
      this.expectedAudience = `/projects/${projectNumber}/global/backendServices/${backendServiceId}`;
    } else {
      throw new Error("invalid argument");
    }
    this.oAuth2Client = new OAuth2Client();
    // Define maxExpiry for testing/debugging.
    // Normally, should not set any value in production.
    this.maxExpiry = undefined;
    debug("initialized successfully");
  }

  /**
   * Verify the ID token from IAP
   * @see https://cloud.google.com/iap/docs/signed-headers-howto
   */
  async verify(iapJwt) {
    if (typeof iapJwt !== "string") {
      debug(`auth failed(iapJwt is invalid: '${iapJwt}')`);
      throw new Error("iapJwt must be string");
    }
    try {
      // Verify the id_token, and access the claims.
      debug("start getIapPublicKeys()");
      const response = await this.oAuth2Client.getIapPublicKeys();
      debug("end getIapPublicKeys()");
      const ticket = await this.oAuth2Client.verifySignedJwtWithCertsAsync(
        iapJwt,
        response.pubkeys,
        this.expectedAudience,
        ["https://cloud.google.com/iap"],
        this.maxExpiry
      );
      debug("auth success!");
      debug(`ticket: ${ticket}`);
      return ticket;
    } catch (e) {
      debug(e);
      throw e;
    }
  }
}

module.exports = Verifier;
