# 📝 PDF OCR Service

This is a FastAPI-based microservice for extracting text from PDF files using Tesseract OCR.

---

## 📌 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/NareshLokhande/Pdf2Html.git
cd service
```

### 2️⃣ Create a Virtual Environment
```sh
py -m venv venv
```

### 3️⃣ Activate the Virtual Environment
- Windows (PowerShell/CMD)
  ```sh
  venv\Scripts\activate
  ```
  
- Mac/Linux
  ```sh
  source venv/bin/activate
  ```

### 4️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 5️⃣ Run the Service
```sh
uvicorn ocr_service:app --host 0.0.0.0 --port 8000 --reload
```

### 🔴 Deactivate Virtual Environment

```sh
deactivate
```

## 🔧 Updating Dependencies
If you install new dependencies, update requirements.txt:

```sh
pip freeze > requirements.txt
```

## ❗Prerequisites
- Python 3.9+
- Tesseract OCR installed (Ensure pytesseract is configured correctly)