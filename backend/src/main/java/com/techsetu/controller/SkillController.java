package com.techsetu.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techsetu.entity.User;
import com.techsetu.repository.UserRepository;
import com.techsetu.service.AiAdapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    @Autowired
    private AiAdapterService aiAdapterService;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSkills(@RequestBody Map<String, String> request, Principal principal) {
        String targetRole = request.get("targetRole");
        String resumeText = request.get("resumeText");

        if (targetRole == null || targetRole.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Target role is required");
        }

        String jsonResult = aiAdapterService.analyzeSkills(targetRole, resumeText);

        // If user is authenticated, update their profile with the target role and computed score
        if (principal != null) {
            try {
                Map<?, ?> result = objectMapper.readValue(jsonResult, Map.class);
                Integer score = (Integer) result.get("bridgeScore");
                
                userRepository.findByUsername(principal.getName()).ifPresent(user -> {
                    user.setTargetRole(targetRole);
                    user.setBridgeScore(score != null ? score : 0);
                    userRepository.save(user);
                });
            } catch (Exception e) {
                // log and continue
            }
        }

        return ResponseEntity.ok(jsonResult);
    }
}
