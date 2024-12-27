package com.example.proj2.repositories;

import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Goal;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GoalRepository extends CrudRepository<Goal, Integer> {
    public Optional<Goal> findByAppUserId(Integer userId);

}
