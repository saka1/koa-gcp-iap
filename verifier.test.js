const Verifier = require("./verifier");

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
  expect(() => new Verifier({ backendServiceId: "SERVICE_ID" })).toThrow(Error);
  expect(() => new Verifier({ projectId: "PROJECT_ID" })).toThrow(Error);
});
