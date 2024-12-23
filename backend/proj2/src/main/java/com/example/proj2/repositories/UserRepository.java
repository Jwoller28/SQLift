package com.example.proj2.repositories;

import com.example.proj2.entity.AppUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<AppUser, Integer> {
    Optional<AppUser> findByUsername(String username);
}