package com.techsetu.controller;

import com.techsetu.entity.Project;
import com.techsetu.entity.Task;
import com.techsetu.entity.User;
import com.techsetu.repository.ProjectRepository;
import com.techsetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProjects(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String username = principal.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<Project> projects = projectRepository.findByMembersContaining(username);
        List<Project> owned = projectRepository.findByOwnerId(userOpt.get().getId());
        
        for (Project p : owned) {
            if (!projects.contains(p)) {
                projects.add(p);
            }
        }
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String name = request.get("name");
        String description = request.get("description");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Project name is required");
        }

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwnerId(userOpt.get().getId());
        project.getMembers().add(principal.getName());

        Project saved = projectRepository.save(project);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<?> addTaskToProject(
            @PathVariable Long projectId,
            @RequestBody Task task,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Project not found");
        }

        Project project = projectOpt.get();
        project.getTasks().add(task);
        projectRepository.save(project);

        return ResponseEntity.ok(project);
    }

    @PutMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody Map<String, String> request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Project not found");
        }

        String newStatus = request.get("status");
        String assignee = request.get("assignee");

        Project project = projectOpt.get();
        boolean taskFound = false;

        for (Task t : project.getTasks()) {
            if (t.getId().equals(taskId)) {
                if (newStatus != null) t.setStatus(newStatus);
                if (assignee != null) t.setAssignee(assignee);
                taskFound = true;
                break;
            }
        }

        if (!taskFound) {
            return ResponseEntity.status(404).body("Task not found");
        }

        projectRepository.save(project);
        return ResponseEntity.ok(project);
    }

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<?> inviteMember(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = request.get("username");
        if (username == null || !userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Valid username is required");
        }

        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Project not found");
        }

        Project project = projectOpt.get();
        if (!project.getMembers().contains(username)) {
            project.getMembers().add(username);
            projectRepository.save(project);
        }

        return ResponseEntity.ok(project);
    }
}
