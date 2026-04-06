package com.carelink.controller;

import com.carelink.dto.BroadcastRequest;
import com.carelink.service.BroadcastService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/broadcast")
public class BroadcastController {

    private final BroadcastService broadcastService;

    public BroadcastController(BroadcastService broadcastService) {
        this.broadcastService = broadcastService;
    }

    @PostMapping("/email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendBroadcastEmail(@RequestBody BroadcastRequest request) {
        broadcastService.sendBroadcast(request);
        return ResponseEntity.ok("Broadcast email sequence started. Emails will be sent in background.");
    }
}
