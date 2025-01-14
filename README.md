# HealthAppoint

HealthAppoint is a comprehensive patient management system designed for healthcare facilities. The system streamlines the scheduling of medical appointments, manages doctor availability, tracks patient histories, and automates appointment reminders and confirmations. It helps doctors and medical staff efficiently manage patient data and appointments, improving workflow and patient experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Setup](#setup)
- [Data Model](#data-model)
- [Use-Case Model](#use-case-model)

## Features

- **Appointment Scheduling**: Easily schedule and manage patient appointments.
- **Patient Profiles**: Maintain detailed patient records, including medical history, diagnoses, and treatment reports.
- **Medical Reports**: Create, edit, and store reports with the option to generate signed PDF documents.
- **Automated Reminders**: Send automated appointment reminders via email or SMS.
- **Doctor Availability**: Customize and manage doctor availability, including special schedules and non-working hours.
- **Confirmation & Tracking**: Patients can confirm their appointments via email/SMS, and confirmed appointments are highlighted in the doctor's calendar.
- **Electronic Signature**: Automatically add the doctor's electronic signature to medical reports.
  
### 1. Authentication and User Management

#### 1.1. Medical Staff
- **Login Interface**: Medical staff authenticate using secure login credentials (username and password) via SSL encryption to ensure confidentiality.
- **Authentication**: User credentials are encrypted using industry-standard hashing algorithms (e.g., bcrypt). Multi-factor authentication (MFA) can be integrated for added security.
- **Session Management**: Secure, token-based authentication (e.g., JWT) for user session handling.
- **Logout**: Secure log-out functionality to terminate the session.

#### 1.2. Doctor
- **Login Interface**: Doctors authenticate using secure login credentials, following the same encryption and session protocols as medical staff.
- **Session Management**: Doctors' sessions are securely maintained during user activity.
- **Logout**: Secure log-out functionality for doctors to terminate their sessions.

---

### 2. Interface for Medical Staff

#### 2.1. Patient Profile Management
- **Search Patient**: A search feature allows medical staff to retrieve patient profiles by name, surname, or phone number. 
- **View and Edit Profile**: Upon selecting a patient, the medical staff can view basic details and make necessary edits. Patient history, including previous appointments, is visible and editable.

#### 2.2. Appointment Scheduling
- **Select Doctor**: Medical staff can choose a doctor from a dropdown populated with doctor details.
- **Available Time Slots**: A calendar view displays doctor availability, with occupied times visually marked. Medical staff can easily pick available slots.
- **Automatic Slot Assignment**: After selecting a free time slot, the system auto-populates `start` and `end` time fields.
- **Patient Selection**: The patient is selected from a dropdown list or added as a new record.
- **Appointment Type**: Appointment types such as "Consultation," "Follow-up," or "Urgent" are selected from a dropdown menu.
- **Additional Notes**: Optional text fields allow staff to provide extra details for the doctor.
- **Slot Validation**: The system verifies that the selected time is available and that the doctor is free.
- **Urgent Appointment**: Urgent appointments are auto-scheduled with the current time, marked as urgent, and include the message: "Urgent appointment automatically scheduled."
- **Confirmation**: On confirmation, the new appointment is saved to the database.

#### 2.3. New Patient Registration
- **Patient Registration Form**: A detailed form allows the medical staff to register new patients, including required fields for personal and contact details.
- **Data Integrity**: Validation checks prevent duplicate records and ensure data consistency.

---

### 3. Interface for Doctor

#### 3.1. Profile Management
- **Profile Overview**: Doctors can view and edit their profiles, which include personal and contact details as well as work hours.
- **Logout**: Doctors can securely log out of the system.

#### 3.2. Appointment Calendar
- **Calendar Overview**: Doctors can view their calendar, switching between monthly and daily views. Each appointment is displayed with the patient’s name.
- **Click-to-View Patient**: Clicking on an appointment opens the patient profile, showing basic info and historical medical reports.

#### 3.3. Medical Report Management
- **View/Edit Reports**: Doctors can access, review, and edit patient reports. The system tracks all edits to ensure version control.
- **Create New Report**: Doctors can create new reports with sections for diagnosis, therapy, recommendations, medical history, and report details.
- **Save, Cancel, or Print**: Doctors can save reports to the patient profile, cancel the report creation, or print the report as a formatted PDF.
- **PDF Generation**: Clicking on the "Print" button generates a formatted PDF report ready for distribution or printing.

#### 3.4. Patient and Appointment Management
- **Add New Patient**: Doctors can add new patients by filling out a registration form.
- **Add Appointment**: Doctors can schedule new appointments directly from the interface.

---

### 4. Application Functionalities

#### 4.1. Automated Patient Reminders
- **24-Hour Reminder**: The system automatically sends appointment reminders to patients via email or SMS 24 hours before the scheduled appointment.
- **Confirmation Request**: Patients must confirm their appointments. Upon confirmation, the appointment is updated to "Confirmed" and visually highlighted in green on the doctor’s calendar.

#### 4.2. PDF Report Generation
- **Report Printing**: Doctors can generate PDF reports, which will be automatically formatted to include relevant details (diagnosis, therapy, etc.).

#### 4.3. Data Access and Feedback
- **Role-Based Access Control (RBAC)**: Access to sensitive patient data is restricted based on user roles (e.g., doctor, medical staff).
- **Data Privacy Compliance**: The system adheres to data privacy regulations (e.g., HIPAA, GDPR).
- **Audit Logs**: User actions, including patient record changes and login attempts, are logged for auditing purposes.

---

## Technologies Used

- **Frontend**: React.js with Material-UI for building the user interface
- **Backend**: Node.js with Express.js for API and server-side logic
- **Database**: PostgreSQL for storing patient, appointment, and report data
- **State Management**: React Context API
- **HTTP Requests**: Axios
- **Calendars**: FullCalendar library for scheduling and managing appointments
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication
- **Notifications**: Email and SMS notifications using SendGrid or Twilio
- **PDF Generation**: PDFKit for generating medical reports as PDFs

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IsidoraJov/HealthAppointProject.git
   cd HealthAppoint

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IsidoraJov/HealthAppointProject.git
   cd HealthAppoint
   
2. Install dependencies for both server and client:
    ```bash
    # Install backend dependencies
    cd server
    npm install

    
    # Install frontend dependencies
    cd ../my-app
    npm install

## Setup

1. **Database Configuration**:
   - Install PostgreSQL and create a database named `healthappoint`.
   - Update the database connection string in `server/src/db.js`.

2. **Environment Variables**:
   - Create a `.env` file in the `server` directory with the following variables:
     ```env
     PORT=8080
     DATABASE_URL=your_database_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_SERVICE_API_KEY=your_email_service_key
     SMS_SERVICE_API_KEY=your_sms_service_key
     ```

3. **Start the Application**:
   - Start the backend server:
     ```bash
     cd server
     npm start
     ```
   - Start the frontend:
     ```bash
     cd my-app
     npm start
     ```
## Data Model

![image](https://github.com/user-attachments/assets/e1953a68-b668-46e4-97a1-371eb4d9fff7)


## Use-Case Model

![image](https://github.com/user-attachments/assets/0bb7eb78-37e4-4a15-a451-1a436ad3cc5b)

