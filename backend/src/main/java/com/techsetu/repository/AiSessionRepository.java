package com.techsetu.repository;

import com.techsetu.entity.AiSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiSessionRepository extends MongoRepository<AiSession, String> {
    List<AiSession> findByUserIdOrderByCreatedAtDesc(Long userId);
}
