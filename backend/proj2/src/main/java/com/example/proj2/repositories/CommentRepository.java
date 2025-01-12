package com.example.proj2.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Post;
import java.util.Optional;
import com.example.proj2.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer>
{

    public Optional<List<Comment>> findAllBySuperComment(Comment c);

    // Get All Comments By User
    public Optional<List<Comment>> findAllByUser(AppUser u);

    // Get All Comments by Post
    public Optional<List<Comment>> findAllByPost(Post p);

}

