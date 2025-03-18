import os
import re
from fastapi import FastAPI, UploadFile, File
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import base64
from io import BytesIO

app = FastAPI()

# Allowed Origins (for CORS)
origins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173", "http://localhost:8080"]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set Tesseract and Poppler Paths
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\poppler-24.08.0\Library\bin"
os.environ["PATH"] += os.pathsep + POPPLER_PATH


# Convert an Image to Base64 format
def image_to_base64(image):
    buffer = BytesIO()
    image.save(buffer, format="PNG")  # Save the image in PNG format
    return base64.b64encode(buffer.getvalue()).decode("utf-8")  # Return as Base64-encoded string


# Extract Question Number Regions
def extract_question_regions(image, padding_x=600, padding_y=600):
    """
    Identify and crop regions for diagrams based on question numbers.

    Parameters:
    - image: Input PIL image.
    - padding_x: Extra width (right side) around the question number.
    - padding_y: Extra height (below) to capture diagrams.

    Returns:
    - List of cropped images (around question numbers).
    """
    question_positions = []
    question_pattern = re.compile(r"(\b\d{1,2}[.)])|(Q\d{1,2})")  # Matches '1.', '2)', '(3)', 'Q4'

    # Extract OCR data with bounding boxes
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

    # Locate all question numbers using the regex pattern
    for i, word in enumerate(data["text"]):
        if question_pattern.search(word):
            # Get the bounding box of the question number
            x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]

            # Crop area:
            #   - Left: Start from the question number's x position.
            #   - Right: Extend more on the right to capture diagrams (padding_x).
            #   - Top: Start from the question number's y position.
            #   - Bottom: Go downwards to capture diagrams (padding_y).
            x1, y1 = max(0, x), max(0, y)
            x2, y2 = min(image.width, x + w + padding_x), min(image.height, y + h + padding_y)

            question_positions.append((x1, y1, x2, y2))

    # Crop and return the regions
    cropped_images = [image.crop(pos) for pos in question_positions]
    return cropped_images

# PDF Text and Image Extraction Endpoint
@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """
    Extracts text and diagrams from an educational PDF.

    Parameters:
    - file: PDF file uploaded by the user.

    Returns:
    - JSON containing extracted text, original images, cropped images, and filename.
    """
    try:
        # 1. Read the PDF file from the request
        pdf_bytes = await file.read()

        # 2. Convert PDF to images (1 image per page)
        images = convert_from_bytes(pdf_bytes, poppler_path=POPPLER_PATH)

        extracted_text = ""  # Store all extracted text
        image_data = []  # Store original images (in Base64)
        cropped_data = []  # Store cropped images around question numbers (in Base64)

        # 3. Process each image (page of PDF)
        for img in images:
            # Extract text from the image using Tesseract OCR
            page_text = pytesseract.image_to_string(img)
            extracted_text += page_text + "\n"

            # Convert the original image to Base64 and store it
            image_data.append(image_to_base64(img))

            # 4. Crop around question numbers (for diagrams) and store the images
            cropped_images = extract_question_regions(img)
            cropped_data.extend(image_to_base64(crop) for crop in cropped_images)

        # 5. Return extracted data in a structured JSON response
        return {
            "filename": file.filename,
            "text": extracted_text.strip(),
            "images": image_data,
            "cropped_images": cropped_data,
        }

    except Exception as e:
        return {"error": str(e)}
    
    
# import os
# import re
# from fastapi import FastAPI, UploadFile, File
# import pytesseract
# from pdf2image import convert_from_bytes
# from PIL import Image
# from fastapi.middleware.cors import CORSMiddleware
# import base64
# from io import BytesIO

# app = FastAPI()

# # Allowed Origins (for CORS)
# origins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173", "http://localhost:8080"]

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Set Tesseract and Poppler Paths
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# POPPLER_PATH = r"C:\poppler-24.08.0\Library\bin"
# os.environ["PATH"] += os.pathsep + POPPLER_PATH


# # Convert an Image to Base64 format
# def image_to_base64(image):
#     buffer = BytesIO()
#     image.save(buffer, format="PNG")  # Save the image in PNG format
#     return base64.b64encode(buffer.getvalue()).decode("utf-8")  # Return as Base64-encoded string


# # Extract Question Number Regions
# def extract_question_regions(image, padding=400):
#     """
#     Identify and crop regions around question numbers (e.g., '1.', '(2)', 'Q3').

#     Parameters:
#     - image: Input PIL image.
#     - padding: Space (in pixels) around the question number.

#     Returns:
#     - List of cropped images (around question numbers).
#     """
#     question_positions = []
#     question_pattern = re.compile(r"(\b\d{1,2}[.)])|(Q\d{1,2})")  # Matches '1.', '2)', '(3)', 'Q4'

#     # Extract OCR data with bounding boxes
#     data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

#     # Locate all question numbers using the regex pattern
#     for i, word in enumerate(data["text"]):
#         if question_pattern.search(word):
#             # Get the bounding box of the question number
#             x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]

#             # Calculate the region to crop with padding
#             x1, y1 = max(0, x - padding), max(0, y - padding)
#             x2, y2 = min(image.width, x + w + padding), min(image.height, y + h + padding)

#             question_positions.append((x1, y1, x2, y2))

#     # Crop the regions around question numbers
#     cropped_images = [image.crop(pos) for pos in question_positions]
#     return cropped_images


# # PDF Text and Image Extraction Endpoint
# @app.post("/extract-text")
# async def extract_text(file: UploadFile = File(...)):
#     """
#     Extracts text and diagrams from an educational PDF.

#     Parameters:
#     - file: PDF file uploaded by the user.

#     Returns:
#     - JSON containing extracted text, original images, cropped images, and filename.
#     """
#     try:
#         # 1. Read the PDF file from the request
#         pdf_bytes = await file.read()

#         # 2. Convert PDF to images (1 image per page)
#         images = convert_from_bytes(pdf_bytes, poppler_path=POPPLER_PATH)

#         extracted_text = ""  # Store all extracted text
#         image_data = []  # Store original images (in Base64)
#         cropped_data = []  # Store cropped images around question numbers (in Base64)

#         # 3. Process each image (page of PDF)
#         for img in images:
#             # Extract text from the image using Tesseract OCR
#             page_text = pytesseract.image_to_string(img)
#             extracted_text += page_text + "\n"

#             # Convert the original image to Base64 and store it
#             image_data.append(image_to_base64(img))

#             # 4. Crop around question numbers (for diagrams) and store the images
#             cropped_images = extract_question_regions(img)
#             cropped_data.extend(image_to_base64(crop) for crop in cropped_images)

#         # 5. Return extracted data in a structured JSON response
#         return {
#             "filename": file.filename,
#             "text": extracted_text.strip(),
#             "images": image_data,
#             "cropped_images": cropped_data,
#         }

#     except Exception as e:
#         return {"error": str(e)}