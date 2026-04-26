package com.carelink.controller;

import com.carelink.entity.Notice;
import com.carelink.repository.NoticeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notices")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<Notice> getLatestActiveNotice() {
        return ResponseEntity.ok(noticeRepository.findTopByActiveTrueOrderByCreatedAtDesc().orElse(null));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        return ResponseEntity.ok(noticeRepository.save(notice));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice noticeDetails) {
        Notice notice = noticeRepository.findById(id).orElseThrow();
        notice.setTitle(noticeDetails.getTitle());
        notice.setContent(noticeDetails.getContent());
        notice.setActive(noticeDetails.isActive());
        return ResponseEntity.ok(noticeRepository.save(notice));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
