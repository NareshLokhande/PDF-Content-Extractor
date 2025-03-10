package com.example.pdfocr.controller;

import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.pdfocr.utils.MultipartInputStreamFileResource;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PdfController {

    private static final String OCR_SERVICE_URL = "http://127.0.0.1:8000/extract-text";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        try {
            // Prepare the request
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Create request entity with the PDF file
            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

            HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send request to FastAPI OCR service
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    OCR_SERVICE_URL,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    }
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }
}

// package com.example.pdfocr.controller;

// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.http.ResponseEntity;
// import org.springframework.http.HttpStatus;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

// import java.io.IOException;
// import java.nio.file.*;

// @RestController
// @RequestMapping("/api/pdf")
// @CrossOrigin(origins = "*")
// public class PdfController {

// // private static final Logger logger =
// LoggerFactory.getLogger(PdfController.class);
// // private static final String UPLOAD_DIR = "uploads/";
// private static final String OCR_SERVICE_URL =
// "http://127.0.0.1:8000/extract-text";

// @PostMapping("/upload")
// public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile
// file) {
// if (file.isEmpty()) {
// return ResponseEntity.badRequest().body("No file uploaded");
// }

// try {
// // Ensure upload directory exists
// Files.createDirectories(Path.of(UPLOAD_DIR));

// // Get a safe filename
// String fileName =
// Path.of(file.getOriginalFilename()).getFileName().toString();

// // Save the uploaded file
// Path filePath = Path.of(UPLOAD_DIR, fileName);
// Files.copy(file.getInputStream(), filePath,
// StandardCopyOption.REPLACE_EXISTING);

// logger.info("File uploaded successfully: {}", fileName);
// return ResponseEntity.ok("File uploaded successfully: " + fileName);

// } catch (IOException e) {
// logger.error("Error uploading file", e);
// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// .body("Error uploading file: " + e.getMessage());
// }
// }
// }
