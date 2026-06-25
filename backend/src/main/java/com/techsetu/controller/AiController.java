package com.techsetu.controller;

import com.techsetu.entity.AiChat;
import com.techsetu.entity.User;
import com.techsetu.repository.AiChatRepository;
import com.techsetu.repository.UserRepository;
import com.techsetu.service.AiAdapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiAdapterService aiAdapterService;

    @Autowired
    private AiChatRepository aiChatRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/chat/history")
    public ResponseEntity<?> getChatHistory(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<AiChat> chats = aiChatRepository.findByUserIdOrderByCreatedAtAsc(userOpt.get().getId());
        return ResponseEntity.ok(chats);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String prompt = request.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Prompt content is required");
        }

        // Get response from dynamic dual-mode service
        String aiResponse = aiAdapterService.askAi(prompt);

        // Save record in MongoDB log collection
        AiChat chatLog = new AiChat(
                null,
                userOpt.get().getId(),
                prompt,
                aiResponse,
                new Date()
        );
        aiChatRepository.save(chatLog);

        return ResponseEntity.ok(chatLog);
    }
}
