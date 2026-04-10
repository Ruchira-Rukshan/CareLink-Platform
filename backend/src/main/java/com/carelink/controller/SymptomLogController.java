package com.carelink.controller;

import com.carelink.dto.SymptomLogRequest;
import com.carelink.dto.SymptomLogResponse;
import com.carelink.entity.SymptomLog;
import com.carelink.entity.User;
import com.carelink.repository.SymptomLogRepository;
import com.carelink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/symptoms")
public class SymptomLogController {

    @Autowired
    private SymptomLogRepository symptomLogRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/logs")
    public ResponseEntity<?> saveLog(@RequestBody SymptomLogRequest request, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SymptomLog log = new SymptomLog();
        log.setUser(user);
        log.setSymptoms(request.getSymptoms());
        log.setPredictedDisease(request.getPredictedDisease());
        
        SymptomLog saved = symptomLogRepository.save(log);
        return ResponseEntity.ok(new SymptomLogResponse(
                saved.getId(), saved.getSymptoms(), saved.getPredictedDisease(), saved.getCreatedAt()
        ));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SymptomLogResponse>> getLogs(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SymptomLogResponse> response = symptomLogRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(log -> new SymptomLogResponse(
                        log.getId(), log.getSymptoms(), log.getPredictedDisease(), log.getCreatedAt()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
}
