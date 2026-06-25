package com.techsetu.repository;

import com.techsetu.entity.AiChat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiChatRepository extends MongoRepository<AiChat, String> {
    List<AiChat> findByUserIdOrderByCreatedAtAsc(Long userId);
}
