package com.example.proj2.Controllers;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.proj2.Configs.JwtUtil;
import com.example.proj2.Services.PostService;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Goal;
import com.example.proj2.entity.Post;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    @RequestParam("message_text") String messageText, @RequestParam("message_tags") String messageTags, @RequestParam("username") String username)
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
    
    //post.setPhoto(fileName);
    //awsService.uploadFile("trackr-photo-store",fileName, fileSize, contentType, inputStream);
    List<String> tags = Arrays.asList(messageTags.split(","));
    post.setTags(tags);

    postService.sendPost(post);

    return ResponseEntity.ok().body("File uploaded successfully");
    }
    catch(Exception ex)
    {
	   return ResponseEntity.badRequest().body(ex.getMessage());
    }

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