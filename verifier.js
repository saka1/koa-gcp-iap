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
    // Verify the id_token, and access the claims.
    const response = await this.oAuth2Client.getIapPublicKeys();
    debug("get iap public keys");
    const ticket = await this.oAuth2Client.verifySignedJwtWithCertsAsync(
      iapJwt,
      response.pubkeys,
      this.expectedAudience,
      ["https://cloud.google.com/iap"]
    );
    debug("auth success!");
    return ticket;
  }
}

module.exports = Verifier;
