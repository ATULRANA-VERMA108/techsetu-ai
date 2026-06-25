package com.techsetu.controller;

import com.techsetu.entity.Blog;
import com.techsetu.entity.Comment;
import com.techsetu.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @GetMapping
    public ResponseEntity<?> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(blogs);
    }

    @PostMapping
    public ResponseEntity<?> createBlog(@RequestBody Blog blog, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        blog.setAuthor(principal.getName());
        blog.setCreatedAt(new Date());
        blog.setLikes(0);
        
        Blog saved = blogRepository.save(blog);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{blogId}/like")
    public ResponseEntity<?> likeBlog(@PathVariable Long blogId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Blog> blogOpt = blogRepository.findById(blogId);
        if (blogOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Blog post not found");
        }

        Blog blog = blogOpt.get();
        blog.setLikes(blog.getLikes() + 1);
        blogRepository.save(blog);

        return ResponseEntity.ok(blog);
    }

    @PostMapping("/{blogId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long blogId,
            @RequestBody Map<String, String> request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String commentContent = request.get("content");
        if (commentContent == null || commentContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Comment content cannot be empty");
        }

        Optional<Blog> blogOpt = blogRepository.findById(blogId);
        if (blogOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Blog post not found");
        }

        Comment comment = new Comment();
        comment.setContent(commentContent);
        comment.setAuthor(principal.getName());
        comment.setCreatedAt(new Date());

        Blog blog = blogOpt.get();
        blog.getComments().add(comment);
        blogRepository.save(blog);

        return ResponseEntity.ok(blog);
    }
}
