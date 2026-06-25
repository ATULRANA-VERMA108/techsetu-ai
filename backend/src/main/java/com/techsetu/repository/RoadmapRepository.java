package com.techsetu.repository;

import com.techsetu.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    Optional<Roadmap> findByUserId(Long userId);
    Optional<Roadmap> findByUserIdAndTargetRole(Long userId, String targetRole);
}
