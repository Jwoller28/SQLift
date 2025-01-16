package com.example.proj2.Controllers;

import com.example.proj2.entity.Goal;
import com.example.proj2.entity.AppUser;

import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.example.proj2.entity.Post;
import com.example.proj2.Services.PostService;
import com.example.proj2.Services.AWSService;
import com.example.proj2.Configs.JwtUtil;

import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import com.example.proj2.entity.Comment;
import com.example.proj2.entity.Post;
import com.example.proj2.Services.CommentService;
import com.example.proj2.Services.PostService;

@RestController
public class PostController {
    
    @Autowired
    final static Logger logger = LoggerFactory.getLogger(PostController.class);
    
    //@Autowired
    //private AWSService awsService;

    @Autowired
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;


    public PostController(PostService postService, ObjectMapper objectMapper, JwtUtil jwtUtil)
    {
	//this.awsService = awsService;
	this.postService = postService;
	this.objectMapper = objectMapper;
    }

    @PostMapping(value = "posts")
    // Turn the Request Param into Request Body with object that has these fields
    public ResponseEntity<String> sendPost(@RequestParam("goal_id") long goalId,
    @RequestParam("user_id") int userId,
    @RequestParam("message_text") String messageText, @RequestParam("message_tags") String messageTags, @RequestParam("username") String username) throws IOException
    {
    try
    {
    logger.info("Arrives at Controller");
    
    //String fileName = StringUtils.cleanPath(photo.getOriginalFilename());
    //String contentType = photo.getContentType();
    //long fileSize = photo.getSize();
    //InputStream inputStream = photo.getInputStream();
   
    Post post = new Post();

    Goal goal = new Goal();
    goal.setId(goalId);
    post.setGoal(goal);
    AppUser appUser = new AppUser();
    appUser.setId(userId);
    appUser.setUsername(username);    
    post.setUser(appUser);
    logger.info("Post Text: " + messageText);
    post.setMessageText(messageText);
    
    // try {
    // //     byte[] photoBytes = photo.getBytes();
    // //     System.out.println(photoBytes);
    // //     post.setPhoto(photoBytes);
    // //     logger.info("File name: " + photo.getOriginalFilename());
    // //     logger.info("File size: " + photo.getSize());
    // //     logger.info("File content type: " + photo.getContentType());
    // // } 
    // }
    // catch (IOException e) {
    //     e.printStackTrace();
    // }
    
    //post.setPhoto(fileName);
    //awsService.uploadFile("trackr-photo-store",fileName, fileSize, contentType, inputStream);


    List<String> tags = Arrays.asList(messageTags.split(","));
    post.setTags(tags);

    postService.sendPost(post);

    
    }
    catch(Exception ex)
    {
	   return ResponseEntity.badRequest().body(ex.getMessage());
    }
    return ResponseEntity.ok().body(post);
    }

    // @GetMapping("/api/posts")
    // public List<Post> getPosts()
    // {   
    //    return postService.getPostList();
    // }


@GetMapping(value="/live/posts")
public ResponseEntity<Post> poll() {

	Post post = postService.getNextPost();
	if(post != null)
	{
		return ResponseEntity.ok().body(post);
	}
	return ResponseEntity.noContent().build();
}


@GetMapping(value="/posts")
public ResponseEntity<List<Post>> getAll(){

	List<Post> posts = postService.getAllPosts();
	
	if(posts != null)
	{
		return ResponseEntity.ok().body(posts);
	}
	return ResponseEntity.noContent().build();
}



}


