package com.example.proj2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proj2.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>
{


}

