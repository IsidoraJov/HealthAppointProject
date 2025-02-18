const request = require("supertest"); 
const app = require("../app"); 
const connection = require("../db"); 

jest.mock("../db"); 
jest.mock("../db", () => ({
  query: jest.fn(),
  end: jest.fn(), 
}));

describe("POST /appointments/check-add", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  afterAll(() => {
    
  });

  it("should add an appointment successfully", async () => {
    const validInput = {
      patientId: 1,
      doctorId: 2,
      typeId: 3,
      start_time: "2025-01-14 10:00:00",
      end_time: "2025-01-14 11:00:00",
      additional_text: "Follow-up visit",
    };

    connection.query.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT")) {
        callback(null, []); // Doctor is available
      } else if (sql.includes("INSERT")) {
        callback(null, { insertId: 42 });
      }
    });

    const res = await request(app).post("/appointments/check-add").send(validInput);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Appointment added successfully!",
      appointment_id: 42,
    });
  });

  it("should return an error if required fields are missing", async () => {
    const invalidInput = {
      patientId: 1,
      doctorId: 2,
    };

    const res = await request(app).post("/appointments/check-add").send(invalidInput);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Missing required fields.",
    });
  });

  it("should return a conflict error if doctor is not available", async () => {
    const conflictInput = {
      patientId: 1,
      doctorId: 2,
      typeId: 3,
      start_time: "2025-01-14 10:00:00",
      end_time: "2025-01-14 11:00:00",
      additional_text: "Routine check-up",
    };

    connection.query.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT")) {
        callback(null, [{ appointment_id: 1 }]); // Doctor is not available
      }
    });

    const res = await request(app).post("/appointments/check-add").send(conflictInput);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: "Doctor is not available in the given time slot.",
    });
  });

  it("should return a database error on query failure", async () => {
    const validInput = {
      patientId: 1,
      doctorId: 2,
      typeId: 3,
      start_time: "2025-01-14 10:00:00",
      end_time: "2025-01-14 11:00:00",
      additional_text: "Follow-up visit",
    };

    connection.query.mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
    });

    const res = await request(app).post("/appointments/check-add").send(validInput);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Internal server error.",
    });
  });

  it("should return a conflict if start_time is valid but end_time overlaps", async () => {
    const overlapInput = {
      patientId: 1,
      doctorId: 2,
      typeId: 3,
      start_time: "2025-01-15 10:00:00",
      end_time: "2025-01-15 11:30:00",
      additional_text: "Extended check-up",
    };

    connection.query.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT")) {
        callback(null, [{ appointment_id: 2 }]); // Overlap detected
      }
    });

    const res = await request(app).post("/appointments/check-add").send(overlapInput);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: "Doctor is not available in the given time slot.",
    });
  });
});