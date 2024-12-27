package com.example.proj2.Controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.proj2.Entity.Post;
import com.example.proj2.Service.PostService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    
    @Autowired
    final static Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @PostMapping("posts")
    @CrossOrigin(origins = "http://localhost:3000")
    // Turn the Request Param into Request Body with object that has these fields
    public void sendPost(@RequestParam("goal_id") long goalId,
    @RequestParam("user_id") long userId,
    @RequestParam("message_text") String messageText,
    @RequestPart("photo") MultipartFile photo)
    {
    logger.info("Arrives at Controller");

    Post post = new Post();
    post.setGoal_id(goalId);    
    post.setUser_id(userId);   
    post.setMessage_text(messageText);

        try {
        byte[] photoBytes = photo.getBytes();
        System.out.println(photoBytes);
        post.setPhoto(photoBytes);
    } catch (IOException e) {
        e.printStackTrace();
    }

    postService.sendPost(post);

    }

    @GetMapping("/posts")
    public List<Post> getPosts()
    {   
       return postService.getPostList();
    }
}

