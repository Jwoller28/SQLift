package com.example.proj2.repositories;


import com.example.proj2.entity.Goal;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Integer> {
    public Optional<Goal> findByAppUserId(Integer userId);
    public Optional<List<Goal>> findAllByAppUserId(Integer userId);

    @Query("SELECT g FROM Goal g WHERE g.appUser.id = :userId AND g.createdAt = (SELECT MAX(g2.createdAt) FROM Goal g2)")
    public Optional<Goal> findMostRecent(@Param("userId") Integer userId);
}
