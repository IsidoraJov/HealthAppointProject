# HealthAppoint

HealthAppoint is a comprehensive patient management system designed for healthcare facilities. The system streamlines the scheduling of medical appointments, manages doctor availability, tracks patient histories, and automates appointment reminders and confirmations. It helps doctors and medical staff efficiently manage patient data and appointments, improving workflow and patient experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)


## Features

- **Appointment Scheduling**: Easily schedule and manage patient appointments.
- **Patient Profiles**: Maintain detailed patient records, including medical history, diagnoses, and treatment reports.
- **Medical Reports**: Create, edit, and store reports with the option to generate signed PDF documents.
- **Automated Reminders**: Send automated appointment reminders via email or SMS.
- **Doctor Availability**: Customize and manage doctor availability, including special schedules and non-working hours.
- **Confirmation & Tracking**: Patients can confirm their appointments via email/SMS, and confirmed appointments are highlighted in the doctor's calendar.
- **Electronic Signature**: Automatically add the doctor's electronic signature to medical reports.

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
## Usage

1. Open your browser and navigate to `http://localhost:3000` to access the frontend.
2. Use the system to perform the following tasks:
   - **Patient Profiles**: Create and manage patient profiles, including medical history and treatment records.
   - **Appointment Scheduling**: Schedule appointments using the interactive calendar interface.
   - **Medical Reports**: Generate, edit, and download signed PDF medical reports.
   - **Notifications**: Send appointment reminders to patients via email or SMS.
   - **Doctor Availability**: View and customize doctor schedules and availability.
3. Confirm and track appointments as patients confirm their availability via email or SMS.



