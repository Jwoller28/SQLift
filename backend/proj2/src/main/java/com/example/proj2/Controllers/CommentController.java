package com.example.proj2.Controllers;

import com.example.proj2.Services.CommentService;
import com.example.proj2.Services.PostService;
import com.example.proj2.Services.UserService;
import com.example.proj2.entity.Comment;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.AppUser;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.Date;
import java.util.List;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class CommentController {
    
    @Autowired
    final static Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    public CommentController(CommentService commentService, PostService postService, UserService userService, ObjectMapper objectMapper)
    {
        this.commentService = commentService;
        this.postService = postService;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(value = "/create/comment")
    public ResponseEntity<String> sendComment(@RequestParam("user_id") int userId, @RequestParam("post_id") long postId, @RequestParam("message_text") String message)
    {
    logger.info("Arrives at Controller");
	Comment c = new Comment();
	
	AppUser user = new AppUser();
	user.setId(userId);
	c.setUser(user);

	Post p = new Post();
	p.setId(postId);
	c.setPost(p);

	c.setText(message);
	
        if(c != null)
            {
                commentService.persistComment(c);
		logger.info(c.toString());
                return ResponseEntity.ok().body("Comment Persisted");
            }
        else{
                return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/comment/sub")
    public ResponseEntity<List<Comment>> getSubComments(@RequestBody Comment c)
    {
        List<Comment> comments = commentService.getSubComments(c);
        if(comments != null)
        {
            return ResponseEntity.ok().body(comments);
        }
        return ResponseEntity.badRequest().build();
    }
    
    @GetMapping("/comment/user")
    public ResponseEntity<List<Comment>> getUserComments(@RequestBody String username)
    {	try
	{
        AppUser u = userService.getUserByUsername(username);
	
        List<Comment> comments = commentService.getUserComments(u);
        if(comments != null)
        {
            return ResponseEntity.ok().body(comments);
        }

	}
	catch(Exception ex)
	{
	return ResponseEntity.badRequest().build();
	}
	return ResponseEntity.badRequest().build();
    }

    @GetMapping("/fetch/comment/{postId}")
    public ResponseEntity<List<Comment>> getPostComments(@PathVariable("postId") Long postId)
    {
        Post p = postService.getAPost(postId);
        logger.info(p.toString());
        List<Comment> comments = commentService.getPostComments(p);
	    logger.info(comments.toString());
        if(comments != null)
        {
            return ResponseEntity.ok().body(comments);
        }
        return ResponseEntity.badRequest().build();
    }

}
