package com.techsetu.controller;

import com.techsetu.entity.AiSession;
import com.techsetu.entity.ChatMessage;
import com.techsetu.entity.User;
import com.techsetu.repository.AiSessionRepository;
import com.techsetu.repository.ChatMessageRepository;
import com.techsetu.repository.UserRepository;
import com.techsetu.service.AiAdapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    @Autowired
    private AiSessionRepository aiSessionRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiAdapterService aiAdapterService;

    @GetMapping
    public ResponseEntity<?> getUserSessions(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<AiSession> sessions = aiSessionRepository.findByUserIdOrderByCreatedAtDesc(userOpt.get().getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{sessionId}/messages")
    public ResponseEntity<?> getSessionMessages(@PathVariable String sessionId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/start")
    public ResponseEntity<?> startInterview(@RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String targetRole = request.getOrDefault("targetRole", "Software Engineer");
        String interviewType = request.getOrDefault("interviewType", "TECHNICAL");
        String language = request.getOrDefault("language", "HINGLISH");

        // Save session in MongoDB
        AiSession session = new AiSession(
                null,
                userOpt.get().getId(),
                targetRole,
                interviewType,
                language,
                true,
                null,
                new Date()
        );
        AiSession savedSession = aiSessionRepository.save(session);

        // Generate opening greeting
        String greeting;
        if (language.equalsIgnoreCase("HINDI")) {
            greeting = "नमस्कार! TechSetu AI इंटरव्यू में आपका स्वागत है। मैं आपका " + 
                       (interviewType.equals("TECHNICAL") ? "तकनीकी" : "HR") + " इंटरव्यूअर हूँ। " +
                       "क्या आप मुझे अपने बारे में और अपने प्रोजेक्ट्स के बारे में बता सकते हैं?";
        } else if (language.equalsIgnoreCase("HINGLISH")) {
            greeting = "Hello and welcome to your TechSetu AI interview! Main aapka " + 
                       (interviewType.equals("TECHNICAL") ? "Technical" : "HR") + " interviewer hoon. " +
                       "Please tell me something about yourself and your tech stack.";
        } else {
            greeting = "Hello and welcome! I am your TechSetu AI " + 
                       (interviewType.equals("TECHNICAL") ? "Technical" : "HR") + " interviewer today. " +
                       "To begin, could you introduce yourself and briefly describe a recent project you worked on?";
        }

        // Save initial message in MongoDB
        ChatMessage welcomeMsg = new ChatMessage(
                null,
                savedSession.getId(),
                "AI",
                greeting,
                new Date()
        );
        chatMessageRepository.save(welcomeMsg);

        Map<String, Object> response = new HashMap<>();
        response.put("session", savedSession);
        response.put("welcomeMessage", welcomeMsg);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/message")
    public ResponseEntity<?> handleCandidateMessage(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String userMsgText = request.get("message");
        if (userMsgText == null || userMsgText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message content cannot be empty");
        }

        Optional<AiSession> sessionOpt = aiSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Session not found");
        }
        AiSession session = sessionOpt.get();

        // 1. Save User Message
        ChatMessage userMessage = new ChatMessage(null, sessionId, "USER", userMsgText, new Date());
        chatMessageRepository.save(userMessage);

        // 2. Fetch existing history and build dialogue context
        List<ChatMessage> history = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        StringBuilder historyBuilder = new StringBuilder();
        for (ChatMessage msg : history) {
            if (!msg.getId().equals(userMessage.getId())) { // exclude the one we just added to send as userMessage separately
                historyBuilder.append(msg.getSender()).append(": ").append(msg.getContent()).append("\n");
            }
        }

        // 3. Generate response using AI Service
        String aiResponseText = aiAdapterService.generateInterviewResponse(
                session.getTargetRole(),
                session.getInterviewType(),
                session.getLanguage(),
                historyBuilder.toString(),
                userMsgText
        );

        // 4. Save AI response
        ChatMessage aiMessage = new ChatMessage(null, sessionId, "AI", aiResponseText, new Date());
        chatMessageRepository.save(aiMessage);

        return ResponseEntity.ok(aiMessage);
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<?> endInterview(@PathVariable String sessionId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<AiSession> sessionOpt = aiSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Session not found");
        }
        AiSession session = sessionOpt.get();
        if (!session.getActive()) {
            return ResponseEntity.ok(session); // already ended
        }

        // Gather all conversations
        List<ChatMessage> history = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        StringBuilder historyBuilder = new StringBuilder();
        for (ChatMessage msg : history) {
            historyBuilder.append(msg.getSender()).append(": ").append(msg.getContent()).append("\n");
        }

        // Evaluate interview performance
        String evaluation = aiAdapterService.evaluateInterview(
                session.getTargetRole(),
                session.getInterviewType(),
                historyBuilder.toString()
        );

        session.setActive(false);
        session.setFeedbackSummary(evaluation);
        AiSession updatedSession = aiSessionRepository.save(session);

        return ResponseEntity.ok(updatedSession);
    }
}
