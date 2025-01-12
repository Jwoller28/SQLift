package com.example.proj2.Services;

import com.example.proj2.entity.PersonalEvent;
import com.example.proj2.repository.PersonalEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonalEventService {
    @Autowired
    private PersonalEventRepository personalEventRepository;

    public PersonalEvent createPersonalEvent(PersonalEvent event) {
        return personalEventRepository.save(event);
    }

    public List<PersonalEvent> getPersonalEventsByUserId(Integer userId) {
        return personalEventRepository.findByUserId(userId);
    }
}
