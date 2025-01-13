const request = require("supertest");
const app = require("../app"); 

describe("SQL Injection Tests for Appointments API", () => {
  it("should prevent SQL injection in GET /appointments/:id", async () => {
    const maliciousId = "1 OR 1=1";
    const response = await request(app).get(`/appointments/${maliciousId}`);

    expect(response.status).toBe(400); // Sada očekujemo 400 zbog validacije
    expect(response.body.error).toBe("Invalid input detected.");
  });

  it("should prevent SQL injection in POST /appointments/add", async () => {
    const maliciousPayload = {
      patientId: "1; DROP TABLE patients;",
      doctorId: "1",
      typeId: "1",
      start_time: "2024-12-20 10:00:00",
      end_time: "2024-12-20 10:30:00",
      additional_text: "Test injection",
    };

    const response = await request(app)
      .post("/appointments/add")
      .send(maliciousPayload);

    expect(response.status).toBe(400); // Sada očekujemo 400 zbog validacije
    expect(response.body.error).toBe("Invalid input detected.");
  });

  it("should prevent SQL injection in GET /appointments/type/:id", async () => {
    const maliciousTypeId = "1; DROP TABLE appointments_type;";
    const response = await request(app).get(`/appointments/type/${maliciousTypeId}`);

    expect(response.status).toBe(400); // Sada očekujemo 400 zbog validacije
    expect(response.body.error).toBe("Invalid input detected.");
  });
});