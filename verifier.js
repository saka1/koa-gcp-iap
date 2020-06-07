"use strict";

const { OAuth2Client } = require("google-auth-library");

class Verifier {
  constructor({ projectNumber, projectId, backendServiceId }) {
    if (
      [projectNumber, projectId, backendServiceId].some(
        (x) => typeof x !== "string"
      )
    ) {
      throw new Error("All arguments must be string");
    }
    this.oAuth2Client = new OAuth2Client();
    this.projectNumber = projectNumber;
    this.projectId = projectNumber;
    this.backendServiceId = backendServiceId;
  }

  /**
   * Verify the ID token from IAP
   * @see https://cloud.google.com/iap/docs/signed-headers-howto
   */
  async verify(iapJwt) {
    if (typeof iapJwt !== "string") {
      throw new Error("iapJwt must be string");
    }

    let expectedAudience = null;
    if (this.projectNumber && this.projectId) {
      // Expected Audience for App Engine.
      expectedAudience = `/projects/${this.projectNumber}/apps/${this.projectId}`;
    } else if (this.projectNumber && this.backendServiceId) {
      // Expected Audience for Compute Engine
      expectedAudience = `/projects/${this.projectNumber}/global/backendServices/${this.backendServiceId}`;
    }
    // Verify the id_token, and access the claims.
    const response = await this.oAuth2Client.getIapPublicKeys();
    const ticket = await this.oAuth2Client.verifySignedJwtWithCertsAsync(
      iapJwt,
      response.pubkeys,
      expectedAudience,
      ["https://cloud.google.com/iap"]
    );
    return ticket;
  }
}

module.exports = Verifier;
