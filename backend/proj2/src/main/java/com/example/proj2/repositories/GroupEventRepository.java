package com.example.proj2.repositories;

import com.example.proj2.entity.GroupEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupEventRepository extends JpaRepository<GroupEvent, Integer> {
    List<GroupEvent> findAllByGroupId(int groupId);
    List<GroupEvent> findAllByGroupIdAndDay(int groupId, String day);
}
