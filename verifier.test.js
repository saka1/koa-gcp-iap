"use strict";

const jwt = require("jsonwebtoken");
const Verifier = require("./verifier");

describe("construction", () => {
  it("should be initializable with projectNumber/backendServiceId", () => {
    const v = new Verifier({
      projectNumber: "PROJECT_NUMBER",
      backendServiceId: "SERVICE_ID",
    });
    expect(v.expectedAudience).toBe(
      "/projects/PROJECT_NUMBER/global/backendServices/SERVICE_ID"
    );
  });

  it("should be initializable with projectNumber/projectId", () => {
    const v = new Verifier({
      projectNumber: "PROJECT_NUMBER",
      projectId: "PROJECT_ID",
    });
    expect(v.expectedAudience).toBe("/projects/PROJECT_NUMBER/apps/PROJECT_ID");
  });

  it("should throw exception when the projectNumber is not string", () => {
    expect(() => new Verifier({ backendServiceId: "SERVICE_ID" })).toThrow(
      Error
    );
    expect(() => new Verifier({ projectId: "PROJECT_ID" })).toThrow(Error);
  });
});

//
// Sample private/public key for testing
//
const privateKey = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIOa4dp2bhYxYzNik+kynQRgLQU1eZIkQxic9fiLKsBh8oAoGCCqGSM49
AwEHoUQDQgAErGrekYU4J4ypoIBSoEv4Ffhv9kXX/26RDEE6XbwfBykjX1wmGDpc
eM3p0TsLmhOA8pY1UaxGNEmi5VybrwN8ew==
-----END EC PRIVATE KEY-----
`;
const pubKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErGrekYU4J4ypoIBSoEv4Ffhv9kXX
/26RDEE6XbwfBykjX1wmGDpceM3p0TsLmhOA8pY1UaxGNEmi5VybrwN8ew==
-----END PUBLIC KEY-----
`;

function createTestJwt(kid) {
  const payload = {
    aud: "/projects/PROJECT_NUMBER/apps/PROJECT_ID",
    email: "mail@example.com",
    exp: Math.floor(Date.now() / 1000) + 30,
    iat: Math.floor(Date.now() / 1000) - 30,
    iss: "https://cloud.google.com/iap",
    sub: "accounts.google.com:xxxxxxxxxxxxxxxxxxxx",
  };
  return jwt.sign(payload, privateKey, {
    algorithm: "ES256",
    header: { kid },
  });
}

test("verify() should accept a valid token", async () => {
  const v = new Verifier({
    projectNumber: "PROJECT_NUMBER",
    projectId: "PROJECT_ID",
  });
  v.oAuth2Client.getIapPublicKeys = () => {
    return { pubkeys: { abcdefg: pubKey } };
  };
  const jwt = createTestJwt("abcdefg");
  const ticket = await v.verify(jwt);
  const payload = ticket.payload;
  expect(payload.email).toBe("mail@example.com");
  expect(payload.sub).toBe("accounts.google.com:xxxxxxxxxxxxxxxxxxxx");
});
