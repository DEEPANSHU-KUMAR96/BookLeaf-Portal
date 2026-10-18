import request from "supertest";
import app from "../src/app.js";

describe("API app", () => {
    test("reports healthy status", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: "ok" });
    });

    test("serves the OpenAPI document", async () => {
        const response = await request(app).get("/api/docs.json");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("openapi");
        expect(response.body).toHaveProperty("paths");
    });

    test("returns a JSON 404 for unknown routes", async () => {
        const response = await request(app).get("/api/does-not-exist");

        expect(response.status).toBe(404);
        expect(response.body.error).toMatch(/Route GET \/api\/does-not-exist not found/);
    });
});
