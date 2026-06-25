package com.techsetu.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status = "TODO"; // "TODO", "IN_PROGRESS", "REVIEW", "DONE"
    private String priority = "MEDIUM"; // "LOW", "MEDIUM", "HIGH"
    private String assignee; // username
}
