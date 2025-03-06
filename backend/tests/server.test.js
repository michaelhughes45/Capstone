const request = require("supertest");
const app = require("../server");

let server;

beforeAll((done) => {
  server = app.listen(0, () => done()); // Use port 0 to assign a random free port
});

afterAll((done) => {
  server.close(done); // Close server after tests
});

describe("Server API Tests", () => {
  it("should return JSON data from /api", async () => {
    const res = await request(server).get("/api");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ value: "Condo Rentals" });
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});