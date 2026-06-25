package com.techsetu.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "ai_chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiChat {
    @Id
    private String id;
    private Long userId;
    private String prompt;
    private String response;
    private Date createdAt = new Date();
}
