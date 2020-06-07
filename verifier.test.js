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
/*
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIOa4dp2bhYxYzNik+kynQRgLQU1eZIkQxic9fiLKsBh8oAoGCCqGSM49
AwEHoUQDQgAErGrekYU4J4ypoIBSoEv4Ffhv9kXX/26RDEE6XbwfBykjX1wmGDpc
eM3p0TsLmhOA8pY1UaxGNEmi5VybrwN8ew==
-----END EC PRIVATE KEY-----
*/
const pubKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErGrekYU4J4ypoIBSoEv4Ffhv9kXX
/26RDEE6XbwfBykjX1wmGDpceM3p0TsLmhOA8pY1UaxGNEmi5VybrwN8ew==
-----END PUBLIC KEY-----
`;

const sampleJwt =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Inh4eCJ9.eyJhdWQiOiIvcHJvamVjdHMvUFJPSkVDVF9OVU1CRVIvYXBwcy9QUk9KRUNUX0lEIiwiZW1haWwiOiJtYWlsQGV4YW1wbGUuY29tIiwiZXhwIjozMjUwMzY4MDAwMCwiaWF0IjoxNTkxNTQzMTM5LCJpc3MiOiJodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vaWFwIiwic3ViIjoiYWNjb3VudHMuZ29vZ2xlLmNvbTp4eHh4eHh4eHh4eHh4eHh4eHh4eCJ9.4BZBltGWdLhts-PvmvphM1ft4SnNO22n01nsw0jhS4vd97OThzEr9yKcm9sLww2u9Kx4jV1LEHAB4V6cL-cXiA";

it("should verity the input", async () => {
  const v = new Verifier({
    projectNumber: "PROJECT_NUMBER",
    projectId: "PROJECT_ID",
  });

  v.oAuth2Client.getIapPublicKeys = () => {
    return { pubkeys: { xxx: pubKey } };
  };
  // Set the very large value to bypass the validation of `exp`.
  // Not a good way, but I don't know the other one.
  v.maxExpiry = 31536000000;

  // console.log(await v.oAuth2Client.getIapPublicKeys());
  const ticket = await v.verify(sampleJwt);
  const payload = ticket.payload;
  expect(payload.email).toBe("mail@example.com");
  expect(payload.sub).toBe("accounts.google.com:xxxxxxxxxxxxxxxxxxxx");
});
