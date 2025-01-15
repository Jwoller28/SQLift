package com.example.proj2.controllers;

import com.example.proj2.Controllers.PostController;
import com.example.proj2.Services.PostService;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.Goal;
import com.example.proj2.entity.AppUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class PostControllerTest {

    @InjectMocks
    private PostController postController;

    @Mock
    private PostService postService;

    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // @Test
    // public void testSendPost() {
    //     Post post = new Post();
    //     post.setMessageText("Test message");
    //     post.setTags(Arrays.asList("tag1", "tag2"));

    //     doNothing().when(postService).sendPost(any(Post.class));

    //     ResponseEntity<String> response = postController.sendPost(null, 1L, 1, "Test message", "tag1,tag2", "testuser");

    //     assertEquals(200, response.getStatusCodeValue());
    //     assertEquals("File uploaded successfully", response.getBody());
    //     verify(postService, times(1)).sendPost(any(Post.class));
    // }

    @Test
    public void testPoll() {
        Post post = new Post();
        post.setMessageText("Test message");

        when(postService.getNextPost()).thenReturn(post);

        ResponseEntity<Post> response = postController.poll();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(post, response.getBody());
        verify(postService, times(1)).getNextPost();
    }

    @Test
    public void testGetAll() {
        Post post1 = new Post();
        post1.setMessageText("Test message 1");

        Post post2 = new Post();
        post2.setMessageText("Test message 2");

        List<Post> posts = Arrays.asList(post1, post2);
        when(postService.getAllPosts()).thenReturn(posts);

        ResponseEntity<List<Post>> response = postController.getAll();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(posts, response.getBody());
        verify(postService, times(1)).getAllPosts();
    }
}