package com.example.proj2.repositories;

import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Tracker;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrackerRepository extends CrudRepository<Tracker, Integer> {
    //public Optional<Tracker> findByAppUserId(Integer userId);
    public Optional<List<Tracker>>findAllByAppUserIdAndGoalId(Integer userId,Integer goalId);

}
