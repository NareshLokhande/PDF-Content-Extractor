# 📄 PDF to HTML Converter
This project extracts text from PDFs using OCR and displays it in a web application while maintaining formatting.

## 🛠 Tech Stack
- Backend API: Spring Boot (`api`)
- OCR Service: FastAPI + Tesseract (`service`)
- Frontend: React + Tailwind (`ui`)

## 🚀 Project Structure
```sh
pdf-to-html-project/
│── api/           # Spring Boot Backend (Handles API requests)
│── service/       # Python OCR Service (Extracts text from PDFs)
│── ui/            # React Frontend (Displays extracted text)
│── README.md          # Project documentation
│── .gitignore         # Ignore unnecessary files
└── ...
```

## 📌 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/NareshLokhande/Pdf2Html.git
cd pdf2HTML
```

### 2️⃣ Backend - Spring Boot (api)
#### 📍 Navigate to the api folder
```sh
cd api
```

#### ⚙️ Build and Run:

```sh
./mvnw spring-boot:run   # For macOS/Linux
mvnw.cmd spring-boot:run  # For Windows
```

#### 💡 API Runs On: `http://localhost:8080`

### 3️⃣ OCR Service - Python (service)
#### 📍 Navigate to the service folder

```sh
cd ../service
```

#### ⚙️ Setup Virtual Environment

```sh
py -m venv venv
```

#### 🟢 Activate Virtual Environment

- Windows:
  ```sh
  venv\Scripts\activate
  ```

- Mac/Linux:
  ```sh
  source venv/bin/activate
  ```
  
#### 📦 Install Dependencies

``` sh
pip install -r requirements.txt
```

#### 🚀 Run the OCR Service
```sh
uvicorn ocr_service:app --host 0.0.0.0 --port 8000 --reload
```

#### 🔴 Deactivate Virtual Environment

  ```sh
  deactivate
  ```

#### 💡 Service Runs On: `http://localhost:8000`

### 4️⃣ Frontend - React (ui)
#### 📍 Navigate to the ui folder

```sh
cd ../ui
```

#### 📦 Install Dependencies
```sh
npm install
```

#### 🚀 Run the React App
```sh
npm start
```

#### 💡 Frontend Runs On: `http://localhost:3000`

## 🔗 API Endpoints Overview

| Component           | Endpoint           | Description                        |
|--------------------|------------------|--------------------------------|
| **OCR Service**    | `POST /extract-text` | Uploads PDF and extracts text |
| **Spring Boot API** | `GET /api/pdf/upload`   | Fetches extracted text data    |
| **Frontend**       | `/`               | Displays extracted text        |


### 🛠 Common Issues & Fixes
1. Port Conflicts?
  - Use --port 8001 for FastAPI or change the React port using:
    ```sh
    set PORT=3001 && npm start
    ```

2. Missing Dependencies?

- Run `pip install -r requirements.txt` (Python)
- Run `npm install` (React)

3. OCR Not Working?

Install Tesseract OCR & add it to the system `PATH`.
## 🤝 Contributing
Pull requests are welcome! Please ensure new features are properly documented. 🚀