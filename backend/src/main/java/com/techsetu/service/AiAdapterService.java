package com.techsetu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class AiAdapterService {
    private static final Logger logger = LoggerFactory.getLogger(AiAdapterService.class);
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.gemini.apiKey:}")
    private String apiKey;

    /**
     * General Developer Chatbot helper response.
     */
    public String askAi(String promptText) {
        if (hasApiKey()) {
            try {
                String prompt = "You are an expert software developer and architect. Answer the user prompt concisely, providing code examples where appropriate: '" + promptText + "'";
                return callGemini(prompt);
            } catch (Exception e) {
                logger.error("Error calling Gemini API for chatbot query: {}. Falling back to simulation.", e.getMessage());
            }
        }
        return getSimulatedChatbotResponse(promptText);
    }

    /**
     * Analyzes user skills relative to a target role.
     */
    public String analyzeSkills(String targetRole, String pastedResume) {
        if (hasApiKey()) {
            try {
                String prompt = "You are an AI Career Coach. Analyze the skills gap for target role: '" + targetRole + 
                                "' based on this candidate profile/resume: '" + pastedResume + "'. " +
                                "Respond ONLY with a valid JSON block containing: \n" +
                                "1. 'bridgeScore': integer (0 to 100)\n" +
                                "2. 'missingSkills': list of strings\n" +
                                "3. 'acquiredSkills': list of strings\n" +
                                "4. 'summary': string explaining the analysis.\n" +
                                "Do not include markdown tags like ```json or ```.";
                return callGemini(prompt);
            } catch (Exception e) {
                logger.error("Error calling Gemini API for skill analysis: {}. Falling back to simulation.", e.getMessage());
            }
        }
        return getSimulatedSkillsAnalysis(targetRole, pastedResume);
    }

    /**
     * Generates a structural roadmap based on a target role and missing skills.
     */
    public String generateRoadmap(String targetRole, List<String> missingSkills) {
        if (hasApiKey()) {
            try {
                String prompt = "Generate a structured learning roadmap for target role: '" + targetRole + 
                                "' focusing on these missing skills: " + missingSkills.toString() + ". " +
                                "Respond ONLY with a valid JSON array of milestones. Each milestone must contain:\n" +
                                "- 'title': string\n" +
                                "- 'description': string\n" +
                                "- 'durationHours': integer\n" +
                                "- 'topics': string (comma-separated list of topics to cover)\n" +
                                "- 'quiz': object containing 'title' (string) and 'questions' (array of objects with 'text' (string), 'choices' (array of strings), and 'correctIndex' (integer 0-3)).\n" +
                                "Do not include markdown tags like ```json or ```.";
                return callGemini(prompt);
            } catch (Exception e) {
                logger.error("Error calling Gemini API for roadmap generation: {}. Falling back to simulation.", e.getMessage());
            }
        }
        return getSimulatedRoadmap(targetRole, missingSkills);
    }

    /**
     * Responds to mock interview conversations.
     */
    public String generateInterviewResponse(String role, String type, String language, String conversationHistory, String userMessage) {
        if (hasApiKey()) {
            try {
                String prompt = "You are a professional " + type + " interviewer conducting an interview for a '" + role + "' position. " +
                                "The user has chosen to speak in: '" + language + "' (if HINGLISH, speak Hindi mixed with English using Latin script). " +
                                "Here is the conversation history: " + conversationHistory + ". " +
                                "The candidate just said: '" + userMessage + "'. " +
                                "Respond naturally as the interviewer. Ask one clear question or provide prompt feedback, and keep your response under 100 words. " +
                                "Do not break character.";
                return callGemini(prompt);
            } catch (Exception e) {
                logger.error("Error calling Gemini API for interview response: {}. Falling back to simulation.", e.getMessage());
            }
        }
        return getSimulatedInterviewResponse(role, type, language, userMessage);
    }

    /**
     * Evaluates the candidate's interview performance and gives scorecards.
     */
    public String evaluateInterview(String role, String type, String conversationHistory) {
        if (hasApiKey()) {
            try {
                String prompt = "Review this interview history for a '" + role + "' role (type: " + type + "): " + conversationHistory + ". " +
                                "Provide a constructive evaluation and feedback summary. Mention:\n" +
                                "1. Core strengths shown\n" +
                                "2. Skill gaps identified\n" +
                                "3. Performance rating (out of 10)\n" +
                                "4. Actionable tips for improvement.";
                return callGemini(prompt);
            } catch (Exception e) {
                logger.error("Error calling Gemini API for interview evaluation: {}. Falling back to simulation.", e.getMessage());
            }
        }
        return getSimulatedInterviewEvaluation(role, type);
    }

    /**
     * Helper to call Gemini REST API.
     */
    private String callGemini(String promptText) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", promptText);
        
        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));
        
        Map<String, Object> contents = new HashMap<>();
        contents.put("contents", List.of(parts));

        String requestBody = objectMapper.writeValueAsString(contents);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP failure status: " + response.statusCode() + " response: " + response.body());
        }

        // Parsing the output
        Map<?, ?> responseMap = objectMapper.readValue(response.body(), Map.class);
        List<?> candidates = (List<?>) responseMap.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
            Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) candidate.get("content");
            List<?> partsList = (List<?>) content.get("parts");
            if (partsList != null && !partsList.isEmpty()) {
                Map<?, ?> part = (Map<?, ?>) partsList.get(0);
                String text = (String) part.get("text");
                // strip optional markdown blocks if the model wrapped it
                return text.replace("```json", "").replace("```", "").trim();
            }
        }
        
        throw new RuntimeException("Failed to extract content from Gemini response: " + response.body());
    }

    private boolean hasApiKey() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    // ----------------------------------------------------
    // HIGH-FIDELITY SIMULATORS (FALLBACK ENGINE)
    // ----------------------------------------------------

    private String getSimulatedChatbotResponse(String prompt) {
        String query = prompt.toLowerCase();
        if (query.contains("debug") || query.contains("error")) {
            return "This looks like a lifecycle or connection error. Ensure your repository interfaces are correctly wired and verify database connectivity pools in your application config files.";
        }
        if (query.contains("architect") || query.contains("design")) {
            return "For high performance, design a stateless web API. Use Spring Boot for REST routes, Redis for caching in-memory queries, and Nginx as your reverse-proxy load balancer.";
        }
        return "Hello! I am your TechSetu AI architect chatbot. Ask me about debugging code, compiler errors, database models, or system architecture layouts.";
    }

    private String getSimulatedSkillsAnalysis(String targetRole, String pastedResume) {
        String roleLower = targetRole.toLowerCase();
        int score = 40 + new Random().nextInt(25); // baseline 40-65 score
        
        List<String> missing = new ArrayList<>();
        List<String> acquired = new ArrayList<>();
        String summary = "";

        if (roleLower.contains("front") || roleLower.contains("react")) {
            missing.addAll(List.of("TypeScript", "Redux Toolkit", "Next.js", "Tailwind CSS", "Jest"));
            acquired.addAll(List.of("HTML5", "CSS3", "JavaScript (ES6)", "React Basics"));
            summary = "Excellent grasp of core frontend basics (React, CSS). However, industry roles expect production practices like state management (Redux), typed code (TypeScript), utility CSS (Tailwind), and automated testing.";
        } else if (roleLower.contains("back") || roleLower.contains("java") || roleLower.contains("spring")) {
            missing.addAll(List.of("Spring Security", "Spring Boot Data JPA", "Docker", "Redis Caching", "PostgreSQL"));
            acquired.addAll(List.of("Java Basics", "SQL Basics", "Git", "REST APIs"));
            summary = "Candidate demonstrates knowledge of basic Java and Web API architecture. To achieve enterprise readiness, you need a deep dive into secure authorization (Spring Security), caching layers (Redis), and container deployment (Docker).";
        } else if (roleLower.contains("data") || roleLower.contains("python")) {
            missing.addAll(List.of("Pandas & NumPy", "Scikit-Learn", "Matplotlib/Seaborn", "SQL Joins & GroupBy", "PowerBI"));
            acquired.addAll(List.of("Python Programming", "Basic Math", "Excel"));
            summary = "Basic programming skillset is solid. The data engineering and machine learning layers present gaps, specifically surrounding structured data wrangling (Pandas) and pipeline orchestration.";
        } else {
            missing.addAll(List.of("REST API Design", "Git Workflows", "System Design Patterns", "Unit Testing", "CI/CD Pipelines"));
            acquired.addAll(List.of("Basic Programming", "Analytical Skills", "Problem Solving"));
            summary = "Your core foundations are strong. Bridge the path to production by focusing on standard Git processes, design patterns, testing suites, and continuous deployment systems.";
        }

        try {
            Map<String, Object> res = new HashMap<>();
            res.put("bridgeScore", score);
            res.put("missingSkills", missing);
            res.put("acquiredSkills", acquired);
            res.put("summary", summary);
            return objectMapper.writeValueAsString(res);
        } catch (Exception e) {
            return "{\"bridgeScore\":50,\"missingSkills\":[],\"acquiredSkills\":[],\"summary\":\"Error generating analysis\"}";
        }
    }

    private String getSimulatedRoadmap(String targetRole, List<String> missingSkills) {
        List<Map<String, Object>> milestones = new ArrayList<>();
        List<String> skills = (missingSkills != null && !missingSkills.isEmpty()) ? missingSkills : List.of("HTML/CSS", "JavaScript", "React", "State Management");

        for (int i = 0; i < skills.size(); i++) {
            String skill = skills.get(i);
            Map<String, Object> ms = new HashMap<>();
            ms.put("title", "Milestone " + (i + 1) + ": Master " + skill);
            ms.put("description", "Acquire core competencies and industry standards regarding " + skill + " to bridge your professional gaps.");
            ms.put("durationHours", 10 + (i * 2));
            
            String topicsStr = skill + " Fundamentals, " + skill + " Architecture, Debugging " + skill + ", Best Practices";
            ms.put("topics", topicsStr);

            Map<String, Object> quiz = new HashMap<>();
            quiz.put("title", skill + " Assessment Gate");
            
            List<Map<String, Object>> questions = new ArrayList<>();
            
            Map<String, Object> q1 = new HashMap<>();
            q1.put("text", "What is a primary design pattern or core constraint when implementing " + skill + "?");
            q1.put("choices", List.of("High coupling and scalability", "Separation of concerns and speed", "Synchronous blocking architecture", "Explicit database locks"));
            q1.put("correctIndex", 1);
            
            Map<String, Object> q2 = new HashMap<>();
            q2.put("text", "Which tool or command is most commonly associated with debugging or building " + skill + "?");
            q2.put("choices", List.of("Docker compile", "Linter and inspector tools", "Direct JVM thread dump", "Cron scheduling"));
            q2.put("correctIndex", 1);

            questions.add(q1);
            questions.add(q2);
            quiz.put("questions", questions);
            ms.put("quiz", quiz);

            milestones.add(ms);
        }

        try {
            return objectMapper.writeValueAsString(milestones);
        } catch (Exception e) {
            return "[]";
        }
    }

    private String getSimulatedInterviewResponse(String role, String type, String language, String userMessage) {
        String lang = language.toUpperCase();
        boolean isHinglish = lang.contains("HINGLISH");
        boolean isHindi = lang.contains("HINDI") && !isHinglish;

        if (isHinglish) {
            return "Acha answer hai! Par conceptually, is standard practice ko implementation level pe deploy kaise karenge? What optimization strategy will you use here?";
        } else if (isHindi) {
            return "यह सही दृष्टिकोण है। क्या आप मुझे बता सकते हैं कि इस सेटअप में एरर हैंडलिंग (Error Handling) और सुरक्षा को कैसे सुनिश्चित किया जाएगा?";
        } else {
            return "That is a reasonable approach. Follow-up: how would you address thread safety, rate-limiting, and concurrent request throughput for this module?";
        }
    }

    private String getSimulatedInterviewEvaluation(String role, String type) {
        return "### Interview Evaluation Summary\n\n" +
                "**Performance Rating**: **7.5 / 10**\n\n" +
                "#### Strengths\n" +
                "- Good conceptual grasp of core tech stacks.\n" +
                "- Fluent vocabulary and problem-solving explanation.\n\n" +
                "#### Identified Gaps\n" +
                "- Lacks design insight into memory configurations or security chains.\n" +
                "- Needs practice explaining architectural details under pressure.\n\n" +
                "#### Actionable Tips\n" +
                "1. Study spring security filter hierarchies and JWT token expirations.\n" +
                "2. Try explaining concepts using real-world projects or metrics instead of abstract terms.";
    }
}
