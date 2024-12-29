package com.example.proj2.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proj2.Entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>
{


}

