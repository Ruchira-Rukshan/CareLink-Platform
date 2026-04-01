package com.carelink.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads/certificates");
    private final Path invoiceDir = Paths.get("uploads/invoices");
    private final Path profileDir = Paths.get("uploads/profiles");
    private final Path reportDir = Paths.get("uploads/reports");

    public FileStorageService() {
        try {
            Files.createDirectories(uploadDir);
            Files.createDirectories(invoiceDir);
            Files.createDirectories(profileDir);
            Files.createDirectories(reportDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage folders!");
        }
    }

    public String saveCertificate(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadDir.resolve(filename));
        return filename;
    }

    public String saveProfilePicture(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), profileDir.resolve(filename));
        return filename;
    }

    public String saveInvoice(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), invoiceDir.resolve(filename));
        return filename;
    }

    public String saveLabReport(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), reportDir.resolve(filename));
        return filename;
    }

    public Path getCertificatePath(String filename) { return uploadDir.resolve(filename); }
    public Path getInvoicePath(String filename) { return invoiceDir.resolve(filename); }
    public Path getProfilePath(String filename) { return profileDir.resolve(filename); }
    public Path getReportPath(String filename) { return reportDir.resolve(filename); }
}
