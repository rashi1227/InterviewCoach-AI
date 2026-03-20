# AI-Powered Interview Coach Web Application

This is a full-stack platform that acts as a realistic mock interview coach. It uses **React (Vite) + TailwindCSS** for the frontend, and **Java (Spring Boot) + PostgreSQL (Supabase)** for the backend.

## Features
- **Resume Upload**: Upload your PDF resume. It maps your skills using Apache Tika.
- **Voice Interactions**: AI reads the questions aloud. You answer using your microphone.
- **Real-Time Transcriptions**: Your speech is live transcribed using Web Speech API.
- **AI Evaluation**: The system evaluates your answers for clarity, technical accuracy, and communication, and generates improved answers.
- **Analytics Dashboard**: View charting and performance over time using Recharts.

## Architecture

* **Backend**: Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL.
* **Frontend**: React 18, Vite, TailwindCSS v4, React Router, Recharts, Lucide React.
* **Database**: Supabase (PostgreSQL).
* **AI Engine**: Pluggable interface (`AiService`). Defaults to a fully functioning `MockAiService` for testing locally without an OpenAI Key. Includes a skeleton `OpenAiService` for easy expansion.

---

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase)
Since you are using Supabase, you do not need to install local Postgres.
1. Obtain your PostgreSQL connection string from your Supabase project settings (Settings -> Database -> Connection string -> JDBC).
2. Open `backend/src/main/resources/application.properties`.
3. Update these lines with your actual Supabase credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://<SUPABASE_HOST>:6543/postgres?user=<USER>&password=<PASSWORD>
   ```
   *(Note: Spring Boot's JPA `update` strategy will automatically generate the required tables the first time the backend boots).*

### 2. Running the Backend (Spring Boot)
Ensure you have **Java 21+** installed.
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run the application using the Maven wrapper:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw spring-boot:run
   ```
3. The backend will start on `http://localhost:8082`.

### 3. Running the Frontend (React + Vite)
Ensure you have **Node.js (v18+)** installed.
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. (Optional) Re-install dependencies if needed:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. The frontend will be accessible at `http://localhost:3000`. 
   *(Note: Ensure you are using Google Chrome or Microsoft Edge to leverage the Web Speech APIs for STT and TTS).*
