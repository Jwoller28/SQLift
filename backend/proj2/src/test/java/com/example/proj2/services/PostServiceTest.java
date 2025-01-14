package com.example.proj2.services;

import com.example.proj2.entity.Post;
import com.example.proj2.repositories.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.util.concurrent.ListenableFuture;
import com.example.proj2.Services.PostService;
import org.springframework.data.domain.Sort;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class PostServiceTest {

    @InjectMocks
    private PostService postService;

    @Mock
    private KafkaTemplate<Long, Post> kafkaPostTemplate;

    @Mock
    private PostRepository postRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendPost() {
        Post post = new Post();
        post.setMessageText("Test message");

        CompletableFuture<SendResult<Long, Post>> future = new CompletableFuture<>();
        future.complete(mock(SendResult.class));

        when(kafkaPostTemplate.send(anyString(), any(Post.class))).thenReturn(future);

        postService.sendPost(post);

        verify(kafkaPostTemplate, times(1)).send(anyString(), any(Post.class));
    }

    @Test
    public void testListen() {
        Post post = new Post();
        post.setMessageText("Test message");

        when(postRepository.saveAndFlush(any(Post.class))).thenReturn(post);

        postService.listen(post);

        verify(postRepository, times(1)).saveAndFlush(any(Post.class));
    }
    @Test
    public void testGetNextPost() {
        Post post = new Post();
        post.setMessageText("Test message");
    
        // Mock the postRepository call, since it's used in the listen method
        when(postRepository.saveAndFlush(any(Post.class))).thenReturn(post);
    
        // Simulate the listen() method by directly invoking it (this populates the queue)
        postService.listen(post);
    
        // Ensure the post is in the queue
        Post result = postService.getNextPost();
    
        // Validate the result
        assertEquals(post, result);
        // Optionally, you can check the size of the queue to make sure it's cleared
        assertTrue(postService.getNextPost() == null);  // No posts left
    }

    @Test
    public void testGetAllPosts() {
        Post post1 = new Post();
        post1.setMessageText("Test message 1");

        Post post2 = new Post();
        post2.setMessageText("Test message 2");

        List<Post> posts = Arrays.asList(post1, post2);
        when(postRepository.findAll(any(Sort.class))).thenReturn(posts);

        List<Post> result = postService.getAllPosts();

        assertEquals(2, result.size());
        verify(postRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    public void testGetAPost() {
        Post post = new Post();
        post.setMessageText("Test message");

        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));

        Post result = postService.getAPost(1L);

        assertEquals(post, result);
        verify(postRepository, times(1)).findById(anyLong());
    }
}