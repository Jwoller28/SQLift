package com.example.proj2.Services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Comment;
import com.example.proj2.repositories.PostRepository;
import com.example.proj2.repositories.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    
    // Get All Comments By User

    public Comment persistComment(Comment comment)
    {
        return commentRepository.saveAndFlush(comment);
    }

    public List<Comment> getUserComments(AppUser u)
    {
        Optional<List<Comment>> comments = commentRepository.findAllByUser(u);

        if(comments.isPresent())
        {
            return comments.get();
        }
        return null;
    }

    // Get All Comments by SuperComment

    public List<Comment> getSubComments(Comment c)
    {
        Optional<List<Comment>> comments = commentRepository.findAllBySuperComment(c);

        if(comments.isPresent())
        {
            return comments.get();
        }
        return null;
    }

    // Get All Comments by Post

    public List<Comment> getPostComments(Post p)
    {
        Optional<List<Comment>> comments = commentRepository.findAllByPost(p);

        if(comments.isPresent())
        {
            return comments.get();
        }
        return null;
    }
    
}  
