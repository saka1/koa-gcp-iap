"use strict";

const { OAuth2Client } = require("google-auth-library");

const oAuth2Client = new OAuth2Client();

/**
 * Verify the ID token from IAP
 * @see https://cloud.google.com/iap/docs/signed-headers-howto
 */
module.exports = async function (
  iapJwt,
  projectNumber,
  projectId,
  backendServiceId
) {
  // TODO check arguments

  let expectedAudience = null;
  if (projectNumber && projectId) {
    // Expected Audience for App Engine.
    expectedAudience = `/projects/${projectNumber}/apps/${projectId}`;
  } else if (projectNumber && backendServiceId) {
    // Expected Audience for Compute Engine
    expectedAudience = `/projects/${projectNumber}/global/backendServices/${backendServiceId}`;
  }
  // Verify the id_token, and access the claims.
  const response = await oAuth2Client.getIapPublicKeys();
  const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
    iapJwt,
    response.pubkeys,
    expectedAudience,
    ["https://cloud.google.com/iap"]
  );
  return ticket;
};
