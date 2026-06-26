package com.techsetu.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techsetu.entity.User;
import com.techsetu.repository.UserRepository;
import com.techsetu.service.AiAdapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private AiAdapterService aiAdapterService;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/submit")
    public ResponseEntity<?> submitCode(@RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String questionId = request.get("questionId");
        String language = request.get("language");
        String code = request.get("code");

        if (questionId == null || language == null || code == null) {
            return ResponseEntity.badRequest().body("Missing required parameters (questionId, language, code)");
        }

        // Call the AI sandbox compilation evaluator
        String evaluationJson = aiAdapterService.evaluateCode(questionId, language, code);

        try {
            Map<?, ?> evaluationMap = objectMapper.readValue(evaluationJson, Map.class);
            Boolean passed = (Boolean) evaluationMap.get("passed");
            
            // If the solution is successful, increment user solved stats
            if (Boolean.TRUE.equals(passed)) {
                User user = userOpt.get();
                user.setSolvedCount(user.getSolvedCount() + 1);
                // Increment streak counter
                if (user.getStreak() == 0) {
                    user.setStreak(1);
                } else {
                    user.setStreak(user.getStreak() + 1);
                }
                userRepository.save(user);
            }
        } catch (Exception e) {
            // Log and allow fallback return
            System.err.println("Failed to parse compiler sandbox json: " + e.getMessage());
        }

        return ResponseEntity.ok(evaluationJson);
    }

    @PostMapping("/explain")
    public ResponseEntity<?> getConceptExplanation(@RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String questionId = request.get("questionId");
        if (questionId == null || questionId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("questionId is required");
        }

        String explanation = aiAdapterService.explainDsaConcept(questionId);
        
        Map<String, String> response = new HashMap<>();
        response.put("explanation", explanation);
        return ResponseEntity.ok(response);
    }
}
