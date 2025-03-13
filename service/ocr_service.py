import os
from fastapi import FastAPI, UploadFile, File
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import base64
from io import BytesIO

app = FastAPI()

origins = ["http://localhost:3000","http://localhost:5173", "http://localhost:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set Tesseract and Poppler paths
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\poppler-24.08.0\Library\bin"
os.environ["PATH"] += os.pathsep + POPPLER_PATH


def image_to_base64(image):
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Read the PDF file
        pdf_bytes = await file.read()

        # Convert PDF to images
        images = convert_from_bytes(pdf_bytes, poppler_path=POPPLER_PATH)

        extracted_text = ""
        image_data = []

        for img in images:
            # Extract text from the image
            extracted_text += pytesseract.image_to_string(img) + "\n"
            # Convert image to base64 and store it
            image_data.append(image_to_base64(img))

        return {
            "filename": file.filename,
            "text": extracted_text.strip(),
            "images": image_data
        }

    except Exception as e:
        return {"error": str(e)}


# for Pdf text extraction only.
# import os
# from fastapi import FastAPI, UploadFile, File
# import pytesseract
# from pdf2image import convert_from_bytes
# from PIL import Image
# from fastapi.middleware.cors import CORSMiddleware


# app = FastAPI()

# origins = ["http://localhost:3000", "http://localhost:8080"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # (Windows only) Uncomment this if you installed Tesseract in a custom location
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# # Manually set Poppler path (use your actual path)
# POPPLER_PATH = r"C:\poppler-24.08.0\Library\bin"
# os.environ["PATH"] += os.pathsep + POPPLER_PATH

# @app.post("/extract-text")
# async def extract_text(file: UploadFile = File(...)):
#     try:
#         # Read the PDF file
#         pdf_bytes = await file.read()
        
#         # Convert PDF to images
#         images = convert_from_bytes(pdf_bytes, poppler_path=POPPLER_PATH)

#         # Extract text from each image
#         extracted_text = ""
#         for img in images:
#             extracted_text += pytesseract.image_to_string(img) + "\n"

#         return {"filename": file.filename, "text": extracted_text.strip()}

#     except Exception as e:
#         return {"error": str(e)}
