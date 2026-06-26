package com.techsetu.controller;

import com.techsetu.dto.AuthDtos.*;
import com.techsetu.entity.User;
import com.techsetu.repository.UserRepository;
import com.techsetu.security.jwt.JwtTokenProvider;
import com.techsetu.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider jwtUtils;

    // In-memory cache for forgot-password OTP validation
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Get actual user entity to retrieve targets, scores, solved counts and streaks
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user.getTargetRole(),
                user.getBridgeScore(),
                user.getSolvedCount(),
                user.getStreak()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(null,
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                null,
                0,
                0,
                0,
                "ROLE_USER");

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        // Find or register the social user
        User user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
            // Generate a random unique username if collisions exist
            String baseUsername = request.getUsername().toLowerCase().replaceAll("\\s+", "");
            String finalUsername = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(finalUsername)) {
                finalUsername = baseUsername + (counter++);
            }

            User newUser = new User(
                    null,
                    finalUsername,
                    request.getEmail(),
                    encoder.encode(UUID.randomUUID().toString()), // random secure password
                    null,
                    0,
                    0,
                    0,
                    "ROLE_USER"
            );
            return userRepository.save(newUser);
        });

        // Generate JWT token programmatically
        String token = jwtUtils.generateTokenFromUsername(user.getUsername());

        return ResponseEntity.ok(new JwtResponse(
                token,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                List.of("ROLE_USER"),
                user.getTargetRole(),
                user.getBridgeScore(),
                user.getSolvedCount(),
                user.getStreak()
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email address not registered."));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpCache.put(request.getEmail(), otp);

        System.out.println("====== [TechSetu Auth] ======");
        System.out.println("Forgot Password OTP for " + request.getEmail() + " is: " + otp);
        System.out.println("=============================");

        // Return sandbox convenience message with the OTP so users don't have to check system stdout log
        return ResponseEntity.ok(new MessageResponse("OTP sent successfully. Sandbox dev OTP is: " + otp));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String cachedOtp = otpCache.get(request.getEmail());
        if (cachedOtp == null || !cachedOtp.equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid or expired OTP verification token."));
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpCache.remove(request.getEmail());

        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully!"));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "solvedCount", "bridgeScore"));
        
        // Strip passwords for security
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("username", u.getUsername());
            entry.put("solvedCount", u.getSolvedCount());
            entry.put("streak", u.getStreak());
            entry.put("bridgeScore", u.getBridgeScore());
            entry.put("targetRole", u.getTargetRole());
            leaderboard.add(entry);
        }
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return ResponseEntity.ok(user);
    }
}
