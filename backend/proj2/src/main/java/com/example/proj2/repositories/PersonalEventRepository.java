package com.example.proj2.repositories;

import com.example.proj2.entity.PersonalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalEventRepository extends JpaRepository<PersonalEvent, Integer> {
    List<PersonalEvent> findByUserId(Integer userId);
}
