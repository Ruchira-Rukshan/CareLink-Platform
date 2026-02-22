package com.carelink.controller;

import com.carelink.repository.UserRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadController {

    private final Path uploadDir = Paths.get("uploads/certificates");
    private final UserRepository userRepository;

    public UploadController(UserRepository userRepository) {
        this.userRepository = userRepository;
        init();
    }

    private void init() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @PostMapping("/certificate")
    public ResponseEntity<String> uploadCertificate(@RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) {
        try {
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = this.uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation);

            userRepository.findByUsername(email).ifPresent(user -> {
                user.setCertificatePath(filename);
                userRepository.save(user);
            });

            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/certificate/{filename:.+}")
    public ResponseEntity<Resource> getCertificate(@PathVariable String filename) {
        try {
            Path file = uploadDir.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "image/jpeg";
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                }
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
