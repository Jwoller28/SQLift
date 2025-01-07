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

@RestController
public class PostController {
    
    @Autowired
    final static Logger logger = LoggerFactory.getLogger(PostController.class);
    
    @Autowired
    private AWSService awsService;

    @Autowired
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private final JwtUtil jwtUtil;


    private ExecutorService nonBlockingService = Executors.newCachedThreadPool();

    public PostController(AWSService awsService, PostService postService, ObjectMapper objectMapper, JwtUtil jwtUtil)
    {
	this.awsService = awsService;
	this.postService = postService;
	this.objectMapper = objectMapper;
	this.jwtUtil = jwtUtil;
    }

    @PostMapping(value = "posts")
    // Turn the Request Param into Request Body with object that has these fields
    public ResponseEntity<String> sendPost(@RequestParam("goal_id") long goalId,
    @RequestParam("user_id") int userId,
    @RequestParam("message_text") String messageText,
    @RequestPart("photo") MultipartFile photo)
    {
    try
    {
    logger.info("Arrives at Controller");
    
    String fileName = StringUtils.cleanPath(photo.getOriginalFilename());
    String contentType = photo.getContentType();
    long fileSize = photo.getSize();
    InputStream inputStream = photo.getInputStream();
   
    Post post = new Post();

    Goal goal = new Goal();
    goal.setId(goalId);
    post.setGoal(goal);

    AppUser appUser = new AppUser();
    appUser.setId(userId);    
    post.setUser(appUser);

    post.setMessage_text(messageText);
    post.setPhoto(fileName);
    awsService.uploadFile("trackr-photo-store",fileName, fileSize, contentType, inputStream);

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


@GetMapping(value="/sse/posts", produces=MediaType.TEXT_EVENT_STREAM_VALUE) //SSE
public ResponseEntity<SseEmitter> poll(HttpServletRequest request) {
    logger.info("Arrives at Controller (GET)");
    
    logger.info(request.getHeader("Authorization"));

    String authHeader = request.getHeader("Authorization");
	// logger.info(authHeader);
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
	    //logger.info(token);
            username = jwtUtil.extractUsername(token);
	    logger.info(username);
        }

        // Proceed with the filter only if we have a valid token and username
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));


                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

    SseEmitter emitter = new SseEmitter(30000L);
    nonBlockingService.execute( () -> {
    try {
        Post post = postService.getNextPost(); // This call waits for the next post
        if (post != null) {
	    String postString = objectMapper.writeValueAsString(post);
		
            emitter.send(postString);
	    emitter.complete();
       }
    }
    catch (Exception e) {
        // Handle interruption gracefully, logging the error and setting the interrupt flag
	emitter.completeWithError(e);
	logger.error("Error processing post: ", e);
    }
    });

    return ResponseEntity.ok().body(emitter);
}

}

