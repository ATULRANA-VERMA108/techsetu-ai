package com.techsetu.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techsetu.entity.*;
import com.techsetu.repository.RoadmapRepository;
import com.techsetu.repository.UserRepository;
import com.techsetu.service.AiAdapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/roadmaps")
@CrossOrigin(origins = "*")
public class RoadmapController {

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiAdapterService aiAdapterService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<?> getActiveRoadmap(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        Optional<Roadmap> roadmapOpt = roadmapRepository.findByUserId(userOpt.get().getId());
        if (roadmapOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No active roadmap found. Please run skill gap analyzer."));
        }

        return ResponseEntity.ok(roadmapOpt.get());
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(@RequestBody Map<String, Object> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String targetRole = (String) request.get("targetRole");
        List<String> missingSkills = (List<String>) request.get("missingSkills");

        if (targetRole == null || targetRole.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Target role is required");
        }

        if (missingSkills == null) {
            missingSkills = new ArrayList<>();
        }

        // Generate JSON representation
        String jsonResult = aiAdapterService.generateRoadmap(targetRole, missingSkills);

        try {
            List<Map<String, Object>> milestoneMaps = objectMapper.readValue(jsonResult, new TypeReference<List<Map<String, Object>>>() {});
            List<Milestone> milestones = new ArrayList<>();

            for (int i = 0; i < milestoneMaps.size(); i++) {
                Map<String, Object> msMap = milestoneMaps.get(i);
                Milestone milestone = new Milestone();
                milestone.setTitle((String) msMap.get("title"));
                milestone.setDescription((String) msMap.get("description"));
                milestone.setTopics((String) msMap.get("topics"));
                
                Object dh = msMap.get("durationHours");
                if (dh instanceof Number) {
                    milestone.setDurationHours(((Number) dh).intValue());
                } else {
                    milestone.setDurationHours(10);
                }
                
                milestone.setCompleted(false);
                // Unlock the first milestone's quiz automatically
                milestone.setQuizUnlocked(i == 0);

                Map<String, Object> quizMap = (Map<String, Object>) msMap.get("quiz");
                if (quizMap != null) {
                    Quiz quiz = new Quiz();
                    quiz.setTitle((String) quizMap.get("title"));
                    quiz.setPassed(false);

                    List<Map<String, Object>> qList = (List<Map<String, Object>>) quizMap.get("questions");
                    if (qList != null) {
                        List<Question> questions = new ArrayList<>();
                        for (Map<String, Object> qMap : qList) {
                            Question question = new Question();
                            question.setText((String) qMap.get("text"));
                            
                            Object choicesObj = qMap.get("choices");
                            if (choicesObj instanceof List) {
                                question.setChoices((List<String>) choicesObj);
                            } else {
                                question.setChoices(new ArrayList<>());
                            }

                            Object ci = qMap.get("correctIndex");
                            if (ci instanceof Number) {
                                question.setCorrectIndex(((Number) ci).intValue());
                            } else {
                                question.setCorrectIndex(0);
                            }
                            questions.add(question);
                        }
                        quiz.setQuestions(questions);
                    }
                    milestone.setQuiz(quiz);
                }
                milestones.add(milestone);
            }

            // Remove any existing roadmap for this user
            roadmapRepository.findByUserId(userOpt.get().getId()).ifPresent(existing -> {
                roadmapRepository.delete(existing);
            });

            Roadmap roadmap = new Roadmap();
            roadmap.setUserId(userOpt.get().getId());
            roadmap.setTargetRole(targetRole);
            roadmap.setDescription("Personalized learning roadmap designed to bridge the gaps to become a " + targetRole + ".");
            roadmap.setMilestones(milestones);

            Roadmap saved = roadmapRepository.save(roadmap);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error parsing roadmap JSON: " + e.getMessage());
        }
    }

    @PostMapping("/milestones/{milestoneId}/complete")
    public ResponseEntity<?> completeMilestone(@PathVariable Long milestoneId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        Optional<Roadmap> roadmapOpt = roadmapRepository.findByUserId(userOpt.get().getId());
        if (roadmapOpt.isEmpty()) {
            return ResponseEntity.status(404).body("No active roadmap found");
        }

        Roadmap roadmap = roadmapOpt.get();
        boolean found = false;
        List<Milestone> milestones = roadmap.getMilestones();
        for (int i = 0; i < milestones.size(); i++) {
            Milestone m = milestones.get(i);
            if (m.getId().equals(milestoneId)) {
                m.setCompleted(true);
                // Unlock the next milestone's quiz if it exists
                if (i + 1 < milestones.size()) {
                    milestones.get(i + 1).setQuizUnlocked(true);
                }
                found = true;
                break;
            }
        }

        if (!found) {
            return ResponseEntity.status(404).body("Milestone not found");
        }

        Roadmap saved = roadmapRepository.save(roadmap);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<String, Object> request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<Integer> answers = (List<Integer>) request.get("answers");
        if (answers == null) {
            return ResponseEntity.badRequest().body("Answers list is required");
        }

        Optional<Roadmap> roadmapOpt = roadmapRepository.findByUserId(userOpt.get().getId());
        if (roadmapOpt.isEmpty()) {
            return ResponseEntity.status(404).body("No active roadmap found");
        }

        Roadmap roadmap = roadmapOpt.get();
        Quiz targetQuiz = null;
        Milestone targetMilestone = null;
        int milestoneIndex = -1;

        List<Milestone> milestones = roadmap.getMilestones();
        for (int i = 0; i < milestones.size(); i++) {
            Milestone m = milestones.get(i);
            if (m.getQuiz() != null && m.getQuiz().getId().equals(quizId)) {
                targetQuiz = m.getQuiz();
                targetMilestone = m;
                milestoneIndex = i;
                break;
            }
        }

        if (targetQuiz == null) {
            return ResponseEntity.status(404).body("Quiz not found");
        }

        List<Question> questions = targetQuiz.getQuestions();
        int correctCount = 0;
        int totalQuestions = questions.size();

        for (int i = 0; i < totalQuestions; i++) {
            if (i < answers.size()) {
                Integer userAnswer = answers.get(i);
                Integer correctAnswer = questions.get(i).getCorrectIndex();
                if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                    correctCount++;
                }
            }
        }

        boolean passed = totalQuestions == 0 || (double) correctCount / totalQuestions >= 0.5;

        if (passed) {
            targetQuiz.setPassed(true);
            targetMilestone.setCompleted(true);
            // Unlock next milestone's quiz
            if (milestoneIndex + 1 < milestones.size()) {
                milestones.get(milestoneIndex + 1).setQuizUnlocked(true);
            }
            roadmapRepository.save(roadmap);
        }

        return ResponseEntity.ok(Map.of(
                "passed", passed,
                "correctCount", correctCount,
                "totalQuestions", totalQuestions
        ));
    }
}
