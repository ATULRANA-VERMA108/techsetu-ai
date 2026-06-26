package com.techsetu.controller;

import com.techsetu.service.AiAdapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/nontech")
@CrossOrigin(origins = "*")
public class NonTechController {

    @Autowired
    private AiAdapterService aiAdapterService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeNonTechRole(@RequestBody Map<String, String> request) {
        String role = request.get("role");
        String skills = request.get("skills");

        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        String jsonResult = aiAdapterService.analyzeNonTechRole(role, skills);
        return ResponseEntity.ok(jsonResult);
    }
}
