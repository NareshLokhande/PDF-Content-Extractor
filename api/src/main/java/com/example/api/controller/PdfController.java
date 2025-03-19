package com.example.api.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.api.utils.MultipartInputStreamFileResource;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Value("${OCR_SERVICE_URL}")
    private String ocrServiceUrl;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

            HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    ocrServiceUrl,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    });

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing file: " + e.getMessage());
        }
    }
}



//For OCR text extraction only  
// package com.example.api.controller;

// import java.util.Map;

// import org.springframework.core.ParameterizedTypeReference;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.util.LinkedMultiValueMap;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.web.multipart.MultipartFile;

// import com.example.api.utils.MultipartInputStreamFileResource;

// @RestController
// @RequestMapping("/api/pdf")
// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
// public class PdfController {

//     private static final String OCR_SERVICE_URL = "http://127.0.0.1:8000/extract-text";

//     @PostMapping("/upload")
//     public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
//         if (file.isEmpty()) {
//             return ResponseEntity.badRequest().body("No file uploaded");
//         }
//         try {
//             // Prepare the request
//             RestTemplate restTemplate = new RestTemplate();
//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.MULTIPART_FORM_DATA);

//             // Create request entity with the PDF file
//             LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//             body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

//             HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

//             // Send request to FastAPI OCR service
//             ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
//                     OCR_SERVICE_URL,
//                     HttpMethod.POST,
//                     requestEntity,
//                     new ParameterizedTypeReference<Map<String, Object>>() {
//                     });

//             return ResponseEntity.ok(response.getBody());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body("Error processing file: " + e.getMessage());
//         }
//     }
// }