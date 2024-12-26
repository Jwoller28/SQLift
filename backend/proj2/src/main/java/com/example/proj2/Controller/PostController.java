package com.example.proj2.Controller;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    private PostService postService;

    @PostMapping("/posts")
    public void sendMessage(@RequestParam("goal_id") long goalId,
    @RequestParam("user_id") long userId,
    @RequestParam("message_text") String messageText,
    @RequestPart("photo") String photo)
    {
    Post post = new Post();
    post.setGoal_id(goalId);    
    post.setUser_id(userId);   
    post.setMessage_text(messageText);
    byte[] decodedBytes = Base64.getDecoder().decode(photo);
    System.out.println(photo);
    post.setPhoto(decodedBytes);
    postService.sendPost(post);
    }

}

