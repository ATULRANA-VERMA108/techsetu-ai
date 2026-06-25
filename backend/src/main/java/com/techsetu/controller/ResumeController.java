package com.techsetu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeResume(@RequestBody Map<String, String> request, Principal principal) {
        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume content is required");
        }

        // Run heuristic-based structured assessment
        int baseScore = 65;
        List<String> improvements = new ArrayList<>();
        List<String> strengths = new ArrayList<>();

        String contentLower = content.toLowerCase();

        // 1. Check for metrics/KPIs (numbers, percentages)
        boolean hasMetrics = contentLower.matches(".*\\d+%.*") || contentLower.matches(".*\\$\\d+.*") || contentLower.matches(".*\\b\\d+\\s*(?:years|months|users|projects|percent|percent|x)\\b.*");
        if (hasMetrics) {
            baseScore += 10;
            strengths.add("Includes quantitative metrics (e.g. percentages, growth numbers).");
        } else {
            improvements.add("Add measurable results. E.g. 'Improved speed by 30%' instead of 'Worked on speed optimization'.");
        }

        // 2. Check for action verbs
        boolean hasActionVerbs = contentLower.contains("developed") || contentLower.contains("designed") || 
                                 contentLower.contains("implemented") || contentLower.contains("led") || 
                                 contentLower.contains("architected") || contentLower.contains("optimized");
        if (hasActionVerbs) {
            baseScore += 10;
            strengths.add("Strong action verbs are used throughout your project descriptions.");
        } else {
            improvements.add("Incorporate active leadership verbs like 'Architected', 'Spearheaded', 'Optimized'.");
        }

        // 3. Contact details checks
        if (contentLower.contains("linkedin.com") || contentLower.contains("github.com")) {
            baseScore += 10;
            strengths.add("Personal links (LinkedIn/GitHub portfolio) are visible.");
        } else {
            improvements.add("Add links to your active GitHub profile or LinkedIn profile.");
        }

        // 4. Length check
        if (content.length() > 500) {
            baseScore += 5;
            strengths.add("Sufficient detail provided for core experiences.");
        } else {
            improvements.add("Expand your experience sections with detailed bullet points showing how you solved problems.");
        }

        // Cap score at 100
        int finalScore = Math.min(baseScore, 100);

        Map<String, Object> scorecard = new HashMap<>();
        scorecard.put("score", finalScore);
        scorecard.put("strengths", strengths);
        scorecard.put("improvements", improvements);
        
        // Dynamic advice
        String generalAdvice = "Your resume shows good potential. ";
        if (finalScore < 80) {
            generalAdvice += "Focus on replacing passive explanations with active accomplishment-oriented sentences to score above 85.";
        } else {
            generalAdvice += "Great job! Your resume aligns well with standard recruiting guidelines. Customize this copy slightly for each specific application.";
        }
        scorecard.put("generalAdvice", generalAdvice);

        return ResponseEntity.ok(scorecard);
    }
}
