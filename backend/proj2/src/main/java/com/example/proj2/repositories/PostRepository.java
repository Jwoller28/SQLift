package com.example.proj2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.example.proj2.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>
{
    @Query("SELECT p FROM Post p JOIN p.appUser u WHERE u.username LIKE %:username%")
    public List<Post> findPostsByUsernameContains(@Param("username") String username);

    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t LIKE %:tag%")
    public List<Post> findPostsByTagsContains(@Param("tag") String tag);

    @Query("SELECT p FROM Post p WHERE p.message_text LIKE %:message%")
    public List<Post> findPostsByTextContains(@Param("message") String message);
}

