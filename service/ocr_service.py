# Using Opencv and Tesseract to extract text from images
import os
import re
from fastapi import FastAPI, UploadFile, File
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import base64
from io import BytesIO
import cv2
import numpy as np

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


def extract_question_regions(image, padding_x=600, padding_y=600, min_area=1000):
    """
    Identify and crop regions for diagrams based on question numbers.
    Improved to handle fragmented diagrams using morphological operations.

    Parameters:
    - image: Input PIL image.
    - padding_x: Width to the right for capturing diagrams.
    - padding_y: Height below for diagrams.
    - min_area: Minimum contour area to consider a diagram as "important."

    Returns:
    - List of cropped images (around question numbers).
    """
    question_positions = []
    question_pattern = re.compile(r"(\b\d{1,2}[.)])|(Q\d{1,2})")  # Matches '1.', '2)', 'Q4'

    # Convert PIL image to OpenCV format
    open_cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # Extract OCR data with bounding boxes
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

    for i, word in enumerate(data["text"]):
        if question_pattern.search(word):
            # Get the bounding box of the question number
            x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]

            # Define the diagram region (below and to the right)
            x1, y1 = max(0, x), max(0, y + h)
            x2, y2 = min(image.width, x + w + padding_x), min(image.height, y + h + padding_y)

            cropped = open_cv_image[y1:y2, x1:x2]

            # Preprocess cropped region for better contour detection
            gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)

            # Adaptive thresholding to handle varying diagram intensities
            thresholded = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 31, 5)

            # Apply morphological closing to connect fragmented diagram parts
            kernel = np.ones((5, 5), np.uint8)
            closed = cv2.morphologyEx(thresholded, cv2.MORPH_CLOSE, kernel)

            # Find contours
            contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            # Sum all contour areas to capture fragmented diagrams
            total_area = sum(cv2.contourArea(cnt) for cnt in contours)

            print(f"Detected region size: {cropped.shape}, Total contour area: {total_area}")

            # Include diagram if the total area meets the threshold
            if total_area >= min_area:
                question_positions.append((x1, y1, x2, y2))
                print("✅ Diagram accepted!")
            else:
                print("❌ Diagram rejected (too small or fragmented).")

    # Crop and return valid diagram regions
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
# # Extract Question Number Regions (Exclude Question Text in Crop)
# def extract_question_regions(image, padding_x=550, padding_y=550, offset_y=50):
#     """
#     Identify and crop regions for diagrams below and to the right of question numbers.

#     Parameters:
#     - image: Input PIL image.
#     - padding_x: Extra width (right side) around the question number.
#     - padding_y: Extra height (below) to capture diagrams.
#     - offset_y: Vertical offset to start cropping below the question.

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

#             # Start cropping BELOW the question number by adding offset_y
#             x1, y1 = max(0, x), min(image.height, y + h + offset_y)
#             x2, y2 = min(image.width, x + w + padding_x), min(image.height, y + h + padding_y)

#             question_positions.append((x1, y1, x2, y2))

#     # Crop and return the regions
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